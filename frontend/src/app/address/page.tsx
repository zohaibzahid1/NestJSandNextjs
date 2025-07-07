"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAddress, saveAddress, updateAddress } from "@/services/AddressApi";
interface Address {
  houseNumber: string;
  street: string;
  town: string;
  city: string;
  state: string;
  country: string;
}
export default function AddressPage() {
  const [address, setAddress] = useState<Address | null>(null);
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
    getAddress()
      .then((data) => {
        if (data) {
          setAddress(data);
          setForm({
            houseNumber: data.houseNumber || "",
            street: data.street || "",
            town: data.town || "",
            city: data.city || "",
            state: data.state || "",
            country: data.country || "",
          });
        }
        setLoading(false);
      })
      .catch((err) => {
        setLoading(true);
        setTimeout(() => {
          setLoading(false);
        }, 1000);
        setError("Failed to load address");
        console.log("error:: ", err);
        router.push("/");
      });
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    try {
      if (address) {
        await updateAddress(form);
      } else {
        await saveAddress(form);
      }
      router.push("/");
    } catch (err) {
      setError("Failed to save address");
      console.log("error:: ", err);
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
          {Object.keys(form).map((key) => (
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