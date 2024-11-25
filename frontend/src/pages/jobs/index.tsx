import { useQuery } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { Job } from './[id]';

type Pagination = {
  currentPage: number
  firstPage: number
  lastPage: number
}

type JobListResponse = {
  pagination: Pagination
  data: Job[]
}

const fetchJobList = async () => {
  const response = await fetch('http://localhost:3333/jobs');
  return response.json();
}

const JobListPage = () => {
  const [page, setPage] = React.useState(null);
  const [search, setSearch] = React.useState('');
  const { data, error, isPending } = useQuery<JobListResponse>({
    queryKey: ['jobs', { search, page }],
    queryFn: fetchJobList,
    enabled: !(search && page),
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(null); // Reset page when search is changed
  };

  return (
    <>
      <input
        type="text"
        value={search}
        onChange={handleSearchChange}
        placeholder="Search jobs"
        className="border p-2 rounded mb-4"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-7 mt-4">
        {data?.data.map((job) => (
          <div key={job.id} className="max-w-xl divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow">
            <div className="px-4 py-5 sm:px-6 text-ellipsis">
              {job.title}
            </div>
            <div className="px-4 py-5 sm:p-6">
              <p className="text-gray-600 truncate">{job.description}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default JobListPage;