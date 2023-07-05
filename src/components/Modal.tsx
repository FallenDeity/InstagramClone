import "react-toastify/dist/ReactToastify.css";

import { addDoc, collection, doc, serverTimestamp, updateDoc } from "@firebase/firestore";
import { getDownloadURL, ref, uploadString } from "@firebase/storage";
import { Dialog, Transition } from "@headlessui/react";
import { CameraIcon } from "@heroicons/react/24/outline";
import assert from "assert";
import Image from "next/image";
import { useSession } from "next-auth/react";
import React, { Fragment, useRef, useState } from "react";
import { BeatLoader } from "react-spinners";
import { toast, ToastContainer } from "react-toastify";
import { useRecoilState } from "recoil";

import { modalState } from "@/components/atoms/modalAtom";
import { db, storage } from "@/utils/firebase";
import { UserSession } from "@/utils/models";

interface UploadEvent extends React.ChangeEvent<HTMLInputElement> {
	target: HTMLInputElement & EventTarget;
}

interface MutableRefObject<T> {
	current: T | null;
}

interface ClickElement extends HTMLInputElement {
	click: () => void;
}

export default function Modal(): React.JSX.Element {
	const { data: session }: { data: UserSession | null | undefined } = useSession();
	const [open, setOpen] = useRecoilState(modalState);
	const filePickerRef: MutableRefObject<ClickElement> = useRef(null);
	const captionRef: MutableRefObject<HTMLInputElement> = useRef(null);
	const [selectedFile, setSelectedFile]: [string | null, React.Dispatch<React.SetStateAction<null>>] = useState(null);
	const [loading, setLoading] = useState(false);
	const uploadPost = async (): Promise<void> => {
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		if (!selectedFile) {
			toast.error("Please select a valid image file!");
			return;
		}
		if (loading) return;
		setLoading(true);
		assert(session?.user && captionRef.current);
		const docRef = await addDoc(collection(db, "posts"), {
			username: session.user.name,
			userid: session.user.uid,
			caption: captionRef.current.value,
			avatar: session.user.image,
			timestamp: serverTimestamp(),
		});
		console.log("New doc added with ID: ", docRef.id);
		const imageRef = ref(storage, `posts/${docRef.id}/image`);
		await uploadString(imageRef, selectedFile, "data_url").then(async () => {
			const downloadURL = await getDownloadURL(imageRef);
			await updateDoc(doc(db, "posts", docRef.id), {
				image: downloadURL,
			});
		});
		setOpen(false);
		setLoading(false);
		setSelectedFile(null);
	};
	const addImageToPost = (e: UploadEvent): void => {
		const reader = new FileReader();
		if (e.target.files) {
			reader.readAsDataURL(e.target.files[0]);
		}
		reader.onload = (readerEvent): void => {
			if (readerEvent.target) {
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-expect-error
				setSelectedFile(readerEvent.target.result);
			}
		};
	};
	return (
		<Transition.Root show={open} as={Fragment}>
			<Dialog as="div" className="fixed z-50 inset-0 overflow-y-hidden" onClose={setOpen}>
				<div className="flex items-end justify-center min-h-[700px] sm:min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
					<ToastContainer />
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0">
						<Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
					</Transition.Child>
					{/* This element is to trick the browser into centering the modal contents. */}
					<span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
						&#8203;
					</span>
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
						enterTo="opacity-100 translate-y-0 sm:scale-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100 translate-y-0 sm:scale-100"
						leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
						<div className="inline-block align-bottom bg-white w-2/3 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
							<div>
								{/* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition */}
								{selectedFile ? (
									<Image
										src={selectedFile}
										alt="Post Image"
										width={100}
										height={100}
										className="w-full object-contain cursor-pointer max-h-56 md:max-h-96"
										onClick={(): void => setSelectedFile(null)}
									/>
								) : (
									<div
										className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 cursor-pointer"
										/* eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-return */
										onClick={(): void => {
											assert(filePickerRef.current !== null);
											filePickerRef.current.click();
										}}>
										<CameraIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
									</div>
								)}
								<div>
									<div className="mt-3 text-center sm:mt-5">
										<Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
											Upload a Photo
										</Dialog.Title>
										<div>
											<input
												type="file"
												accept="image/*"
												hidden
												ref={filePickerRef}
												onChange={addImageToPost}
											/>
										</div>
										<div className="mt-2">
											<input
												type="text"
												ref={captionRef}
												className="border-none focus:ring-0 w-full text-center"
												placeholder="Please enter a caption..."
											/>
										</div>
									</div>
								</div>
								<div className="mt-5 sm:mt-6">
									<button
										disabled={loading}
										/* eslint-disable-next-line @typescript-eslint/no-misused-promises */
										onClick={uploadPost}
										type="button"
										className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm disabled:bg-red-300 disabled:cursor-not-allowed hover:disabled:bg-red-300">
										{loading ? <BeatLoader color="#ffffff" size={10} /> : "Upload Post"}
									</button>
								</div>
							</div>
						</div>
					</Transition.Child>
				</div>
			</Dialog>
		</Transition.Root>
	);
}
