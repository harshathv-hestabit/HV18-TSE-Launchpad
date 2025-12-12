export default function SampleBox({ text }) {
    return (
        <div
            className="mt-1 p-1 border-radius-8 bg-white w-fit text-black rounded"
        >
            <strong>API Message: </strong> {text || "Loading..."}
        </div>
    );
}
