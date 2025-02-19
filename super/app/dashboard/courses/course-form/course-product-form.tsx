import { Button } from "@/registry/new-york/ui/button"
import { Input } from "@/registry/new-york/ui/input"
import { Label } from "@/registry/new-york/ui/label"
import { Textarea } from "@/registry/new-york/ui/textarea"
import MultipleSelector, { Option } from '@/components/ui/multiple-selector';
import Editor from 'react-simple-wysiwyg';
import { useRef, useState, useEffect } from "react";
import { Checkbox } from "@/registry/new-york/ui/checkbox";
import Image from "next/image";
import { del } from "@vercel/blob";
import { ExternalLink, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";


interface Course {
  _id: string
  title: string
  category: string
  description: string
  stock: string
  tags: string[]
  regularPrice: string
  salePrice: string
  mode: string
  active: boolean
  published: boolean
  image: any[]
  admin_id: string
  creator_role: string
  created_by: string
  created_at: string
  slug: string
  slugId: string
  updated_at: string
  order: string
}

const OPTIONS: Option[] = [
  { label: 'online', value: 'online' },
  { label: 'offline', value: 'offline' }
];

type PutBlobResult = {
  url: string;
};

interface CourseFormProps {
  course?: Course,
  token: string
}

export function ProductCourseForm({ course, token }: CourseFormProps) {
  const [html, setHtml] = useState('');
  const inputFileRef = useRef<HTMLInputElement | null>(null);
  const [blob, setBlob] = useState<PutBlobResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tags, setTags] = useState('');
  const [description, setDescription] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (course) {
      setDescription(course.description);
      setTags(course?.tags?.join(', ')); // Convert array to comma-separated string
      setHtml(course?.description);
    }
  }, [course]);

  const cleanTags = (input: string) => {
    // Remove tags that are just spaces, dots, or special characters
    return input?.split(',')?.map(tag => tag.trim())?.filter(tag => tag.length > 0 && /[a-zA-Z0-9]/.test(tag)); // Keep only alphanumeric tags
  };
  const cleanedTags = cleanTags(tags);


  const [formData, setFormData] = useState({
    title: course?.title || '',
    regularPrice: course?.regularPrice || '',
    salePrice: course?.salePrice || '',
    description: course?.description || '',
    imgage: course?.image || [],
    tags: cleanedTags, // Convert comma-separated string to array
    category: course?.category || '',
    mode: course?.mode || '',
    published: course?.published || false,
    slug: course?.slug || '',
    order: course?.order || '',
  });

  const [formErrors, setFormErrors] = useState({
    title: '',
    regularPrice: '',
    salePrice: '',
  });

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);

    try {
      const file = e.target.files?.[0];
      if (!file) {
        throw new Error("No file selected");
      }

      const response = await fetch(`/api/avatar/upload?filename=${encodeURIComponent(file.name)}`, {
        method: "POST",
        body: file,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const newBlob = (await response.json()) as PutBlobResult;
      setBlob(newBlob);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      // Clear the file input for another upload
      if (inputFileRef.current) {
        inputFileRef.current.value = "";
      }
    }
  };

  async function deleteBlob(blobUrl: string) {
    try {
      await del(blobUrl);
      console.log(`Blob deleted successfully: ${blobUrl}`);
    } catch (error) {
      console.error('An error occurred while deleting the blob:', error);
    }
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    const errors = {
      title: '',
      regularPrice: '',
      salePrice: '',
    };

    let isValid = true;

    if (!formData.title) {
      errors.title = 'Title is required';
      isValid = false;
    }

    if (!formData.regularPrice) {
      errors.regularPrice = 'Regular Price is required';
      isValid = false;
    }

    if (!formData.salePrice) {
      errors.salePrice = 'Sale Price is required';
      isValid = false;
    }

    setFormErrors(errors);

    return isValid;
  };

  function onHtmlChange(e: any) {
    setHtml(e.target.value);
  }

  const onHandleSave = async () => {
    const isValid = validateForm();

    if (!isValid) {
      return;
    }

    const courseData = {
      ...formData,
      tags: cleanedTags,
      description: html,
      image: blob ? [blob?.url] : course?.image?.length ? course?.image : [],
    };

    try {
      const response = await fetch(course ? `/api/courses/${course._id}` : '/api/courses', {
        method: course ? 'POST' : 'POST',
        headers: {
          "Content-Type": "application/json",
          token: `Bearer ${token}`,
        },
        body: JSON.stringify(courseData),
      });

      if (!response.ok) {
        throw new Error('Failed to save course');
      }
      router.push('/dashboard/courses');
      // Handle successful save (e.g., show success message or redirect)
      console.log('Course saved successfully');
    } catch (err) {
      console.error(err);
      setError('Failed to save the course');
    }
  };

  useEffect(() => {
    if (course) {
      setFormData({
        ...formData,
        title: course.title,
        regularPrice: course.regularPrice,
        salePrice: course.salePrice,
        description: course.description,
        tags: course.tags,
        category: course.category,
        mode: course.mode,
        published: course.published,
        slug: course.slug,
        imgage: course.image,
        order: course.order,
      });
    }
  }, [course]);

  return (
    <div>
      <div className='h-full flex-1 flex-col px-8 md:flex'>
        <div className='flex items-center justify-between space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>{course ? 'Edit Course' : 'New Course'}</h2>
          </div>
          <Button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2" variant='default' size='sm' onClick={onHandleSave}>
            Save
          </Button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-4 mt-4 min-h-screen auto-rows-fr">
          <div className="lg:col-span-7 h-[500px]">
            <div className="">
              <div className='w-full'>
                <Label htmlFor={'title'}>Title</Label>
                <Input className="bg-white"
                  type={'text'}
                  name={'title'}
                  placeholder={'Course title'}
                  value={formData.title}
                  onChange={onChange}
                />
                {formErrors.title && <span className="text-red-600">{formErrors.title}</span>}
              </div>
              <div className='w-full mt-6'>
                <Label htmlFor={'slug'}>Desire page url</Label>
                <div className="flex rounded-lg shadow-sm relative">
                  <div className="flex items-center justify-center pointer-events-none text-gray-500 text-sm px-3 pr-0 py-1 rounded rounded-r-0 h-9 dark:text-neutral-500 border-[1px] border-r-0 bg-gray-50">
                    <span>https://www.rxtn.in/courses/</span>
                  </div>
                  <Input className={`bg-white ${formData.slug && `rounded-r-none border-r-0 pl-0 border-l-0 rounded-l-none outline-l-none`}`}
                    name={'slug'}
                    placeholder={'Page url'}
                    value={formData.slug}
                    onChange={onChange}
                  />
                  {formData.slug ?
                    (<Link href={`https://www.rxtn.in/courses/${formData.slug}`} target="blank" className="p-1 px-2 border bg-gray-50 rounded-r-lg hover:bg-blue-700 group">
                      <ExternalLink className='h-6 w-6 opacity-70 group-hover:text-white' />
                    </Link>) : <></>
                  }

                </div>
              </div>
              <div className='w-full mt-6'>
                <Label htmlFor={'description'}>Description</Label>
                <Editor name="description" className="h-80 overflow-y-scroll p-5" value={html} onChange={onHtmlChange} />
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
                <div className="w-full mt-6">
                  <Label htmlFor={'regularPrice'}>Regular Price</Label>
                  <Input className="bg-white"
                    type={'text'}
                    name={'regularPrice'}
                    placeholder={'Course Regular Price'}
                    value={formData.regularPrice}
                    onChange={onChange}
                  />
                  {formErrors.regularPrice && <span className="text-red-600">{formErrors.regularPrice}</span>}
                </div>
                <div className="w-full mt-6">
                  <Label htmlFor={'salePrice'}>Sale Price</Label>
                  <Input className="bg-white"
                    type={'text'}
                    name={'salePrice'}
                    placeholder={'Course Sale Price'}
                    value={formData.salePrice}
                    onChange={onChange}
                  />
                  {formErrors.salePrice && <span className="text-red-600">{formErrors.salePrice}</span>}
                </div>
                <div className="lg:col-span-2">
                  <div className="w-full mt-6">
                    <Label htmlFor={'tags'}>Tags</Label>
                    <Input className="bg-white"
                      type={'text'}
                      name={'tags'}
                      placeholder={'Course tags'}
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 h-[600px] flex flex-col">
            <div className="p-4 border rounded shadow bg-gray-50 flex-1">
              <div className="space-y-2">
                <Label htmlFor={'af-submit-app-upload-images'}>
                  Image
                </Label>
                <label htmlFor="af-submit-app-upload-images" className="group p-4 sm:p-7 block cursor-pointer text-center border-2 border-dashed border-gray-200 rounded-lg focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 dark:border-neutral-700">
                  <Input ref={inputFileRef} accept="image/*"
                    onChange={handleFileSelect} className="sr-only" id="af-submit-app-upload-images" name="af-submit-app-upload-images" type="file" />
                  <svg className="size-10 mx-auto text-gray-400 dark:text-neutral-600" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M7.646 5.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 6.707V10.5a.5.5 0 0 1-1 0V6.707L6.354 7.854a.5.5 0 1 1-.708-.708l2-2z" />
                    <path d="M4.406 3.342A5.53 5.53 0 0 1 8 2c2.69 0 4.923 2 5.166 4.579C14.758 6.804 16 8.137 16 9.773 16 11.569 14.502 13 12.687 13H3.781C1.708 13 0 11.366 0 9.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383zm.653.757c-.757.653-1.153 1.44-1.153 2.056v.448l-.445.049C2.064 6.805 1 7.952 1 9.318 1 10.785 2.23 12 3.781 12h8.906C13.98 12 15 10.988 15 9.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 4.825 10.328 3 8 3a4.53 4.53 0 0 0-2.941 1.1z" />
                  </svg>
                  <span className="mt-2 block text-sm text-gray-800 dark:text-neutral-200">
                    Browse your device or <span className="group-hover:text-blue-700 text-blue-600">drag 'n drop</span>
                  </span>
                  <span className="mt-1 block text-xs text-gray-500 dark:text-neutral-500">
                    Maximum 1 file
                  </span>
                </label>
              </div>
              <div className="w-full mt-6">
                {(blob || course?.image?.length) ? (
                  <div className="mt-4">
                    <Label htmlFor={''}>
                      Selected Image
                    </Label>
                    <div className="relative">
                      <Image alt="" src={blob?.url ? blob?.url : course?.image?.length ? course?.image[0] : ''} width={100} height={100} className="text-blue-500 underline" />
                    </div>
                  </div>
                ) : <></>}
              </div>
              <div className="w-full mt-6">
                <Label htmlFor={'category'}>Category</Label>
                <Input className="bg-white"
                  type={'text'}
                  name={'category'}
                  placeholder={'Course category'}
                  value={formData.category}
                  onChange={onChange}
                />
              </div>
              <div className="w-full mt-6">
                <Label htmlFor={'mode'}>Mode</Label>
                <Input className="bg-white"
                  type={'text'}
                  name={'mode'}
                  placeholder={'Course mode'}
                  value={formData.mode}
                  onChange={onChange}
                />
              </div>
              <div className="w-full mt-6">
                <Label htmlFor={'order'}>Order</Label>
                <Input className="bg-white"
                  type={'text'}
                  name={'order'}
                  placeholder={'Course Order'}
                  value={formData.order}
                  onChange={onChange}
                />
              </div>
              <div className="w-full mt-6">
                <div className='flex items-center space-x-2 mt-2'>
                  <Checkbox
                    id={'published'}
                    checked={formData.published}
                    onCheckedChange={() => setFormData({ ...formData, published: !formData.published })}
                  />
                  <Label htmlFor={'published'}>Published</Label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
