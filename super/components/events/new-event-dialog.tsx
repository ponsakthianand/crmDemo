"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";

import { useTaskStore } from "@/lib/store";
import { ChangeEvent, FormEvent, useState } from "react";
import { DatePicker } from "../ui/datepicker";

export default function NewEventDialog() {
  const [product, setProduct] = useState({
    name: "",
    category: "",
    description: "",
    stock: "",
    tags: "",
    regularPrice: "",
    salePrice: "",
    active: false,
    published: false,
    image: null as File | null,
  });
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setProduct({ ...product, [name]: checked });
    } else {
      setProduct({ ...product, [name]: value });
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setProduct({ ...product, image: file });
  };
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log(product);
  };
  const addTask = useTaskStore((state) => state.addTask);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm">
          ＋ Add New Event
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-4xl">
        <DialogHeader>
          <DialogTitle>Add New Event</DialogTitle>
          {/* <DialogDescription>
            What do you want to get done today?
          </DialogDescription> */}
        </DialogHeader>
        <form
          id="product-form"
          className="flex flex-col gap-4 py-4"
          onSubmit={handleSubmit}
        >
          {" "}
          <div className="flex gap-4">
            {" "}
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={product.name}
              onChange={handleChange}
              className="flex-1 border border-gray-300 p-2 rounded"
            />{" "}
            <select
              name="category"
              value={product.category}
              onChange={handleChange}
              className="flex-1 border border-gray-300 p-2 rounded"
            >
              {" "}
              <option value="" disabled>
                Select Category
              </option>{" "}
              <option value="category1">Category 1</option>{" "}
              <option value="category2">Category 2</option>{" "}
            </select>{" "}
          </div>{" "}
          <div className="flex gap-4">
            {" "}
            <div className="flex-1 border-dashed border-2 border-gray-300 p-4 rounded cursor-pointer">
              {" "}
              <label
                htmlFor="file-upload"
                className="flex items-center justify-center h-full"
              >
                {" "}
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                />{" "}
                <span>
                  {product.image
                    ? product.image.name
                    : "Drop files here or click to upload"}
                </span>{" "}
              </label>{" "}
            </div>{" "}
          </div>{" "}
          <div className="flex gap-4">
            {" "}
            <textarea
              name="description"
              placeholder="Description"
              value={product.description}
              onChange={handleChange}
              className="flex-1 border border-gray-300 p-2 rounded"
            />{" "}
          </div>{" "}
          <div className="flex gap-4">
            {" "}
            <input
              type="text"
              name="stock"
              placeholder="Stock"
              value={product.stock}
              onChange={handleChange}
              className="flex-1 border border-gray-300 p-2 rounded"
            />{" "}
            <input
              type="text"
              name="tags"
              placeholder="Tags"
              value={product.tags}
              onChange={handleChange}
              className="flex-1 border border-gray-300 p-2 rounded"
            />{" "}
          </div>{" "}
          <div className="flex gap-4">
            {" "}
            <input
              type="text"
              flex-1
              name="regularPrice"
              placeholder="Regular Price"
              value={product.regularPrice}
              onChange={handleChange}
              className="flex-1 border border-gray-300 p-2 rounded"
            />{" "}
            <input
              type="text"
              name="salePrice"
              placeholder="Sale Price"
              value={product.salePrice}
              onChange={handleChange}
              className="flex-1 border border-gray-300 p-2 rounded"
            />{" "}
          </div>{" "}
          <div className="flex gap-4">
            {" "}
            <div className="flex items-center flex-1">
              <label className="flex items-center flex-1 justify-center">
                {" "}
                <input
                  type="checkbox"
                  name="isChecked"
                  checked={product.active}
                  onChange={handleChange}
                  className="mr-2 "
                />{" "}
                <span>Active</span>{" "}
              </label>
              <label className="flex items-center flex-1 justify-center">
                {" "}
                <input
                  type="checkbox"
                  name="isPublish"
                  checked={product.published}
                  onChange={handleChange}
                  className="mr-2 "
                />{" "}
                <span>Published</span>{" "}
              </label>
            </div>{" "}
            <select
              name="category"
              value={product.category}
              onChange={handleChange}
              className="flex-1 ml-7 border border-gray-300 p-2 rounded"
            >
              {" "}
              <option value="" disabled>
                Select Mode
              </option>{" "}
              <option value="online">Online</option>{" "}
              <option value="offline"> Offline</option>{" "}
            </select>{" "}
          </div>{" "}
          <div className="flex gap-4">
            <div className="flex-1">
              <label
                htmlFor="Frequency"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Start Date
              </label>
              <div className="mt-2 ">
                <DatePicker
                  setStateValue={setStartDate}
                  stateValue={startDate}
                />
              </div>
            </div>
            <div className="flex-1">
              <label
                htmlFor="Frequency"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                End Date
              </label>
              <div className="mt-2 ">
                <DatePicker
                  setStateValue={setStartDate}
                  stateValue={startDate}
                />
              </div>
            </div>
          </div>
          <div className="text-center mt-4">
            {" "}
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              {" "}
              Save Event{" "}
            </button>{" "}
          </div>{" "}
        </form>
        {/* <DialogFooter>
          <DialogTrigger asChild>
            <Button type="submit" size="sm" form="todo-form">
              Add Event
            </Button>
          </DialogTrigger>
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
}

// Event date
// event time
// event duration
