"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function AddressPage() {
  const [address, setAddress] = useState<unknown>(null);
  const [form, setForm] = useState({
    houseNumber: "",
    street: "",
    town: "",
    city: "",
    state: "",
    country: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    axios.get("http://localhost:3000/users/get-address", { withCredentials: true })
      .then(res => {
        if (res.status === 200 && res.data.address) {
          setAddress(res.data.address);
          setForm({
            houseNumber: res.data.address.houseNumber || "",
            street: res.data.address.street || "",
            town: res.data.address.town || "",
            city: res.data.address.city || "",
            state: res.data.address.state || "",
            country: res.data.address.country || "",
          });
        }
        setLoading(false);
      })
      .catch(err => {
        // show loading for 1 second then show error and redirect to home page
        setLoading(true);
        setTimeout(() => {
          setLoading(false);
        }, 1000);
        setError("Failed to load address");
        console.log("error:: ",err);
        router.push("/");
      });
  }, );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // set the form state to the new value
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    // if the address is not found then we will save the address for the first time and if it is found then we will update the address
    const url = address
      ? "http://localhost:3000/users/update-address"
      : "http://localhost:3000/users/save-address";
    // patch for update and post for save
    const method = address ? "patch" : "post";
    try {
      await axios({
        method,
        url,
        data: form,
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
      router.push("/");
    } catch (err) {
      setError("Failed to save address");
      console.log("error:: ",err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="text-lg text-blue-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">{address ? "Update Address" : "Add Address"}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {Object.keys(form).map(key => (
            <input
              key={key}
              name={key}
              placeholder={key}
              value={form[key as keyof typeof form]}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 capitalize"
            />
          ))}
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded transition font-semibold">
            {address ? "Update Address" : "Save Address"}
          </button>
        </form>
      </div>
    </div>
  );
} 