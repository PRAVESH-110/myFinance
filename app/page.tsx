"use client";

export default function Home() {
  return (
    <div className="font-sans min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <h1 className="text-center bold text-3xl"><b> Hi, myFinance this side. I'm your personal finance tracker app</b></h1><br></br>
      <h1 className="text-center pb-4 ">Please verify your identity to continue</h1>
      
      <form className="max-w-sm mx-auto mt-8 border p-6 max-h rounded-lg shadow-md bg-white">
        <div className="mb-4 h-16">
          <label
            htmlFor="email"
            className="block text-gray-700 font-bold mb-2"
          >
            Email:
          </label>
          <input
            type="email"
            id="email"
            className="w-full px-3 py-2 h-9 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-gray-700 font-bold mb-2"
          >
            Password:
          </label>
          <input
            type="password"
            id="password"
            className="w-full px-3 py-2 border h-9 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <button onclick ="alert('Login Successful')"
            type="submit"
            className="bg-blue-400 mt-5 items-center align-self:center w-full border px-2 py-1 h-10 hover:cursor-pointer hover:bg-blue-500 border-black rounded-xl ">Login</button>
        </div>
        </form>
    </div>
  );
}
