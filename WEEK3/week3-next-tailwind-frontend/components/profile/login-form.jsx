"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

export default function LoginForm() {
    const [open, setOpen] = useState(true);
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Login submitted");
    };
    const router = useRouter();


    return (

        // <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="min-h-screen flex items-center justify-center">

            {/* <Modal open={open} onClose={() => setOpen(false)}> */}
            <Modal open={open} onClose={() => router.push("/")}>
                <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">
                    Login
                </h2>

                <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                    <div className="flex items-center border rounded-md bg-gray-100 px-3 py-2">
                        <span className="text-gray-500 mr-2"></span>
                        <input
                            type="text"
                            placeholder="Username"
                            className="bg-transparent w-full outline-none text-gray-700 placeholder:text-gray-400"
                        />
                    </div>

                    <div className="flex items-center border rounded-md bg-gray-100 px-3 py-2">
                        <span className="text-gray-500 mr-2"></span>
                        <input
                            type="password"
                            placeholder="Password"
                            className="bg-transparent w-full outline-none text-gray-700 placeholder:text-gray-400"
                        />
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-600">
                        <label className="flex items-center gap-2">
                            <input type="checkbox" className="h-4 w-4" />
                            <span>Remember me</span>
                        </label>

                        <button type="button" className="text-gray-500 hover:underline">
                            Forgot Password?
                        </button>
                    </div>

                    <Button variant="success" type="submit">
                        LOGIN
                    </Button>
                </form>
            </Modal>
        </div>
    );
}
