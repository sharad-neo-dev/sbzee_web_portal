import React, { useState } from "react";
import {
  useAddDeliveryAddressMutation,
  useGetFlatsByTowerQuery,
  useGetTowersBySocietyQuery,
  useSearchSocietiesQuery,
} from "@/redux/services/deliveryAddressApi";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

type AddressType = "home" | "office" | "friends and family" | "other";

const AddDeliveryAddressSection = () => {
  const [societyInput, setSocietyInput] = useState("");
  const [selectedSociety, setSelectedSociety] = useState<string | null>(null);
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [selectedTower, setSelectedTower] = useState<string | null>(null);
  const [selectedFlat, setSelectedFlat] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    addressType: "home" as AddressType,
    phoneNumber: "",
    contactPerson: "",
  });

  /* ---------------- Queries ---------------- */

  const { data: societiesData } = useSearchSocietiesQuery(
    { input: societyInput },
    { skip: societyInput.length < 2 }
  );

  const { data: towersData } = useGetTowersBySocietyQuery(
    { societyId: selectedSociety as string },
    { skip: !selectedSociety }
  );

  const { data: flatsData } = useGetFlatsByTowerQuery(
    { towerId: selectedTower as string },
    { skip: !selectedTower }
  );

  /* ---------------- Normalized data ---------------- */

  const societies = societiesData?.data ?? [];
  const towers = towersData?.data ?? [];
  const flats = flatsData?.data?.data ?? [];

  const [addDeliveryAddress, { isLoading }] = useAddDeliveryAddressMutation();

  /* ---------------- Submit ---------------- */

  const handleAddAddress = async () => {
    if (!selectedSociety || !selectedArea) {
      toast.error("Please select a society");
      return;
    }

    try {
      await addDeliveryAddress({
        name: form.name,
        addressType: form.addressType,
        area: selectedArea,
        society: selectedSociety,
        tower: selectedTower,
        flat: selectedFlat,
        phoneNumber: form.phoneNumber,
        contactPerson: form.contactPerson,
      }).unwrap();

      toast.success("Delivery address added");
    } catch {
      toast.error("Failed to add address");
    }
  };

  return (
    <div className="space-y-4">
      {/* -------- Search Society -------- */}
      <div>
        <Input
          placeholder="Search society"
          value={societyInput}
          onChange={(e) => setSocietyInput(e.target.value)}
        />

        {societies.length > 0 && (
          <div className="border rounded mt-2 max-h-40 overflow-y-auto">
            {societies.map((society) => (
              <div
                key={society.id}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  setSelectedSociety(society.id);
                  setSelectedArea(society.area);
                  setSocietyInput(society.name);
                }}>
                {society.name}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* -------- Select Tower -------- */}
      {towers.length > 0 && (
        <select
          className="w-full border rounded p-2"
          onChange={(e) => setSelectedTower(e.target.value)}>
          <option value="">Select Tower</option>
          {towers.map((tower) => (
            <option key={tower.id} value={tower.id}>
              {tower.name}
            </option>
          ))}
        </select>
      )}

      {/* -------- Select Flat -------- */}
      {flats.length > 0 && (
        <select
          className="w-full border rounded p-2"
          onChange={(e) => setSelectedFlat(e.target.value)}>
          <option value="">Select Flat</option>
          {flats.map((flat) => (
            <option key={flat.id} value={flat.id}>
              {flat.number}
            </option>
          ))}
        </select>
      )}

      {/* -------- Address Details -------- */}
      <Input
        placeholder="Address Name (Home / Office)"
        value={form.name}
        onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
      />

      <select
        className="w-full border rounded p-2"
        value={form.addressType}
        onChange={(e) =>
          setForm((p) => ({
            ...p,
            addressType: e.target.value as AddressType,
          }))
        }>
        <option value="home">Home</option>
        <option value="office">Office</option>
        <option value="friends and family">Friends & Family</option>
        <option value="other">Other</option>
      </select>

      <Input
        placeholder="Phone Number"
        value={form.phoneNumber}
        onChange={(e) =>
          setForm((p) => ({ ...p, phoneNumber: e.target.value }))
        }
      />

      <Input
        placeholder="Contact Person"
        value={form.contactPerson}
        onChange={(e) =>
          setForm((p) => ({ ...p, contactPerson: e.target.value }))
        }
      />

      <button
        disabled={isLoading}
        onClick={handleAddAddress}
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
        {isLoading ? "Adding..." : "Add Address"}
      </button>
    </div>
  );
};

export default AddDeliveryAddressSection;
