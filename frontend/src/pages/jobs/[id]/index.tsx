
import React from 'react';

export type Job = {
  id: string;
  title: string;
  description: string;
  company: string;
  isFavorite: boolean;
};

const fetchJob = async (id: string) => {
  const response = await fetch(`http://localhost:3333/jobs/${id}`);
  const data = await response.json();
  return data;
}

const JobPage = () => {

  return (
    <> </>
  );
};

export default JobPage;