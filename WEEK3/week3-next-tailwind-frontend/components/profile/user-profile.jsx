"use client"
export default function ProfileView() {
  const user = {
    name: "Nina Valentine",
    job: "Actress",
    email: "nina_val@example.com",
    image:
      "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&w=600&q=60",
    bio: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent aliquet odio augue, 
in dapibus lacus imperdiet ut. Quisque elementum placerat neque rhoncus tempus. 
Cras id suscipit diam, sit amet rutrum ipsum. Vestibulum rutrum elit lacinia sapien porta pulvinar. 
Neque rhoncus tempus. Cras id suscipit diam, sit amet rutrum ipsum. 
Vestibulum rutrum elit lacinia sapien porta pulvinar.`,
    socials: {
      linkedin: "linkedin.com",
      twitter: "www.x.com",
      facebook: "facebook.com",
    },
  };

  return (
    <div className="bg-white p-6 rounded-md shadow">
      <button
        className="text-blue-600 text-sm mb-4 hover:underline"
        onClick={() => history.back()}
      >
        ← Go back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border p-6 rounded-md">
        
        <div className="flex justify-center md:justify-start">
          <img
            src={user.image}
            alt={user.name}
            className="w-48 h-48 object-cover rounded-md border"
          />
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <h3 className="text-xs text-gray-500">Name</h3>
            <p className="text-lg font-semibold">{user.name}</p>
          </div>

          <div>
            <h3 className="text-xs text-gray-500">Job Title</h3>
            <p className="text-gray-700">{user.job}</p>
          </div>

          <div>
            <h3 className="text-xs text-gray-500">Email</h3>
            <p className="text-blue-600 hover:underline cursor-pointer">
              {user.email}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <h3 className="text-xs text-gray-500">LinkedIn</h3>
            <p className="text-blue-600 hover:underline cursor-pointer">
              {user.socials.linkedin}
            </p>
          </div>

          <div>
            <h3 className="text-xs text-gray-500">Twitter</h3>
            <p className="text-blue-600 hover:underline cursor-pointer">
              {user.socials.twitter}
            </p>
          </div>

          <div>
            <h3 className="text-xs text-gray-500">Facebook</h3>
            <p className="text-blue-600 hover:underline cursor-pointer">
              {user.socials.facebook}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-xs text-gray-500 mb-1">Bio</h3>
        <p classn="text-gray-700 leading-relaxed">{user.bio}</p>
      </div>
    </div>
  );
}
