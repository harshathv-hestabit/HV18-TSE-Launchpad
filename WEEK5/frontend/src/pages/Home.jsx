import { useEffect, useState } from "react";
import api from "../api/apiClient";
import SampleBox from "../components/SampleBox";

export default function Home() {
    const [data, setData] = useState(null);
    const [taskInput, setTaskInput] = useState("");
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        api
            .get("/sample")
            .then((res) => setData(res.data.message))
            .catch((err) => {
                console.error("Sample API error:", err.message);
                setData("Error fetching data");
            });
    }, []);
    useEffect(() => {
        api
            .get("/taskUpdates")
            .then(res => setTasks(res.data.updates || []))
            .catch((err) => {
                console.error("Task Updates API error:", err.message);
                setTasks([]);
            });
    }, []);


    const addTask = () => {
        if (!taskInput.trim()) return;

        api.post("/taskUpdates", { text: taskInput })
            .then(res => {
                setTasks(prev => [res.data.updates, ...prev]);
                setTaskInput("");
            });
    };

    return (
        <div className="bg-gray-500 p-2 h-screen w-screen overflow-scroll">
            <h1 className="text-center text-2xl text-white hover:scale-120 hover:text-blue-200">
                Docker App: Frontend + Backend + Database
            </h1>

            <div className="border-black border-2 rounded-lg bg-white p-5 m-2">
                <h2 className="text-center font-bold">
                    Some Important things to note about this app
                </h2>

                <div className="flex p-4 gap-6 m-2 italic text-white flex-wrap">
                    <p className="p-2 bg-gray-500 rounded-md shadow-md w-fit h-fit hover:scale-110 hover:drop-shadow-2xl transition-transform duration-500 ease-in-out">
                        Uses NGINX for establishing reverse proxy, load balancing, secure connection
                    </p>

                    <p className="p-2 bg-gray-500 rounded-md shadow-md w-fit h-fit hover:scale-110 hover:drop-shadow-2xl transition-transform duration-500 ease-in-out">
                        Frontend server is React+Vite app. Runs in dev mode. uses TailwindCSS for styling.
                    </p>

                    <p className="p-2 bg-gray-500 rounded-md shadow-md w-fit h-fit hover:scale-110 hover:drop-shadow-2xl transition-transform duration-500 ease-in-out">
                        Backend server is a Node+Express server. Handles db connection and sends a sample message as shown below:
                    </p>
                    <SampleBox text={data} />

                    <p className="p-2 bg-gray-500 rounded-md shadow-md w-fit h-fit hover:scale-110 hover:drop-shadow-2xl transition-transform duration-500 ease-in-out">
                        List of docker containers include the following: Frontend, Backend(2 containers), Mongodb, NGINX, Mongodb. All share the same docker network 'd2'
                    </p>

                    <p className="p-2 bg-gray-500 rounded-md shadow-md w-fit h-fit hover:scale-110 hover:drop-shadow-2xl transition-transform duration-500 ease-in-out">
                        Currently this landing page simulates a full stack application where you can add task updates only.
                    </p>
                </div>
            </div>

            <div className="border-black border-2 rounded-lg bg-white p-5 m-2">
                <h2 className="text-xl font-semibold mb-3">Add Updates here</h2>

                <div className="flex gap-2 mb-4">
                    <input
                        value={taskInput}
                        onChange={(e) => setTaskInput(e.target.value)}
                        className="border p-2 rounded w-full"
                        placeholder="Enter a new task..."
                    />
                    <button
                        onClick={addTask}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Add
                    </button>
                </div>

                <h3 className="font-bold mb-2">Daily Task Updates:</h3>
                <ul className="space-y-2">
                    {tasks.map((task) => (
                        <li key={task._id} className="p-2 text-white bg-gray-500 rounded">
                            {task.text}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}