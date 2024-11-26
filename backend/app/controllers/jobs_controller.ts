import FavoriteJob from "#models/favorite_job";
import { HttpContext } from "@adonisjs/core/http";

type Pagination = {
  currentPage: number
  firstPage: number
  lastPage: number
}

type APIJob = {
  id: number
  job_title: string
  description: string
  company: string
}

type APIJobListResponse = {
  pagination: Pagination
  data: APIJob[]
}

type APIRecommendationResponse = {
  searchQuery: {
    jobTitle: string
  }
  jobIds: number[]
}

type Job = {
  id: number
  title: string
  description: string
  company: string
  isFavorite: boolean
}

type JobListResponse = {
  pagination: Pagination
  data: Job[]
}


// Create own controller following RESTful conventions.
// The external API is subject to change, but we want a stable api for our frontend to consume.
// This gives us the flexibility to make changes to the contract easily for future features, such as favouriting jobs.
export default class JobsController {
  public async index({ request, response }: HttpContext) {
    try {
      let { search, page } = request.qs()
      // The pagination of the external api is zero index based, this might change in the future.
      // We should reach out to the API team to get more insight, but for now we assume it is stable and won't change soon.
      // We do not know what the LastPage value is when searching via the ../jobs/recommendation, so we set it to 0 for now.
      // Reach out to UX and see how many items per page they want to display, as this might differ from what the external api returns.
      page = page && page >= 0 ? page : 0;

      const pagination = {
        currentPage: page,
        firstPage: 0,
        lastPage: 0,
      }

      let res: JobListResponse = {
        pagination,
        data: []
      }

      // This approach is not ideal as there might be other params we want to support in the future.
      // Due to time constraints, we are not implementing a more robust solution.
      let jobIds: number[] = []
      if (!!search) {
        if (search.length < 2) {
          throw new Error('Search query must be at least 2 characters long')
        }
        // We have no way to ensure the ID's returned from the search corrospond with the jobs in a given page,
        // nor if the order of returned jobs is determanistisc.
        // We don't want to sort the list as there might be an algorithm in place sorting the jobs in a specific way for a given user,
        // so we keep the list of items as is until we have more information.
        jobIds = await this.fetchJobIds(search)
        res.data = await this.fetchJobsFromIds(jobIds)
      } else {
        res = await this.fetchJobs(page)
      }

      const favoriteJobIds = await FavoriteJob.query()
        .select('job_id')
        .where('userId', 1)
        .whereIn('jobId', jobIds)

      res.data = res.data.map((job) => ({
        ...job,
        isFavorite: favoriteJobIds.some((favorite) => favorite.jobId === job.id),
      }))

      return response.status(200).json(res)
    } catch (error) {
      // We should take care of different errors, for now we log out the specific error
      // while sending the same error to the frontend.
      console.log(error)
      return response.status(500).json({
        error: 'Error fetching jobs', // Error key here
      })
    }
  }

  public async show({ response, params }: HttpContext) {
    try {
      const apiResponse = await fetch(`https://yon9jygrt9.execute-api.eu-west-1.amazonaws.com/prod/jobs/${params.id}`)
      const apiJob = await apiResponse.json() as APIJob
      const job = this.serializeJobResponse(apiJob)

      const favoriteId = await FavoriteJob.query().select('jobId').where('userId', 1).where('jobId', job.id)
      job.isFavorite = !!favoriteId

      return response.status(200).json(job)

    } catch (error) {
      console.log('Error fetching job', error)
      return response.status(500).json({
        error: 'Error fetching job', // Error key here
      })
    }
  }

  public async favoriteJob({ response, params }: HttpContext) {
    try {
      // We should ensure the user is authenticated before allowing them to favorite a job
      // due to time constraints, we are not implementing authentication and instead setting the user id to 1
      const userId = 1
      const jobId = params.id

      // Think about how to handle malicious requests.
      // Currently, an IT adept user could send arbitrary requests to /jobs/:id/favorite while logged in,
      // spamming the database with rows for jobs that do not exists.
      const job = await FavoriteJob.query().where('userId', userId).where('jobId', jobId).first()

      if (job) {
        await job.delete()
        response.status(200).json({ message: 'Job favorited' })
      } else {
        await FavoriteJob.create({ userId, jobId })
        response.status(200).json({ message: 'Job unfavorited' })
      }

    } catch (error) {
      console.log('Error favoriting job', error)
      return response.status(500).json({
        error: 'Error favoriting job', // Error key here
      })
    }
  }

  private async fetchJobIds(search: string): Promise<number[]> {
    const searchUrl = 'https://yon9jygrt9.execute-api.eu-west-1.amazonaws.com/prod/jobs/recommendations';
    const searchResponse = await fetch(searchUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ "jobTitle": search }),
    });

    if (!searchResponse.ok) {
      throw new Error('Error fetching job recommendations');
    }

    const searchBody = (await searchResponse.json()) as APIRecommendationResponse;
    return searchBody.jobIds;
  }

  private async fetchJobsFromIds(jobIds: number[]): Promise<Job[]> {
    // Reach out to the API team and ask if there is a way to fetch multiple jobs at once.
    // If not, is there a rate limit we should be aware of?
    const jobs = await Promise.all(
      jobIds.map(async (id) => {
        const jobResponse = await fetch(`https://yon9jygrt9.execute-api.eu-west-1.amazonaws.com/prod/jobs/${id}`);
        if (!jobResponse.ok) {
          throw new Error('Error fetching job details');
        }
        return jobResponse.json();
      })
    );

    return jobs as Job[];
  }

  private serializeJobListResponse(apiJobs: APIJobListResponse): JobListResponse {
    return {
      pagination: apiJobs.pagination,
      data: apiJobs.data.map((job) => ({
        id: job.id,
        title: job.job_title,
        description: job.description,
        company: job.company,
        isFavorite: false,
      }))
    }
  }

  private async fetchJobs(page: number): Promise<JobListResponse> {
    const apiResponse = await fetch(`https://yon9jygrt9.execute-api.eu-west-1.amazonaws.com/prod/jobs?page=${page}`)
    if (!apiResponse.ok) {
      throw new Error('Error fetching jobs')
    }

    const apiBody = await apiResponse.json() as APIJobListResponse
    return this.serializeJobListResponse(apiBody)
  }

  private serializeJobResponse(job: APIJob): Job {
    return {
      id: job.id,
      title: job.job_title,
      description: job.description,
      company: job.company,
      isFavorite: false,
    }
  }








}