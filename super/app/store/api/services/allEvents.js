import axios from "@/app/api";

const eventServices = {
  fetchEvents: () => axios.get(`/api/events`),
};

export default eventServices;
