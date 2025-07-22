import React, { useState } from "react";
import { db } from "../../firebase";
import { ref, update } from "firebase/database";

export default function FormModalComparisonMSE({ data, onClose }) {
  const [tanggal, setTanggal] = useState("");
  const [monitoring, setMonitoring] = useState(
    data.monitoring.map((mon) => ({
      uraian: mon.uraian,
      items: mon.items.map((item) => ({
        nama: item.nama,
        hasil: "",
      })),
    }))
  );

  const handleItemChange = (monIdx, itemIdx, value) => {
    const updated = [...monitoring];
    updated[monIdx].items[itemIdx].hasil = value;
    setMonitoring(updated);
  };

  const handleAddItem = (monIdx) => {
    const updated = [...monitoring];
    updated[monIdx].items.push({ nama: "", hasil: "" });
    setMonitoring(updated);
  };

  const handleRemoveItem = (monIdx, itemIdx) => {
    const updated = [...monitoring];
    updated[monIdx].items.splice(itemIdx, 1);
    setMonitoring(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await update(ref(db, `mse/${data.id}`), {
      comparison: monitoring,
      comparisonDate: tanggal,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-10 overflow-y-auto z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <h2 className="text-xl font-bold mb-2">
            Input Data Perbandingan Monitoring MSE
          </h2>

          {/* Tanggal Monitoring */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Tanggal Perbandingan Monitoring
            </label>
            <input
              type="date"
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
              className="border px-3 py-2 rounded w-full focus:outline-none focus:ring-1 focus:ring-yellow-400"
              required
            />
          </div>

          {/* Monitoring Section */}
          <div className="space-y-6">
            {monitoring.map((mon, monIdx) => (
              <div
                key={monIdx}
                className="bg-gray-50 border rounded-lg p-4 shadow-sm"
              >
                <h3 className="font-semibold text-gray-800 mb-4">
                  {mon.uraian}
                </h3>

                <div className="space-y-4">
                  {mon.items.map((item, itemIdx) => (
                    <div
                      key={itemIdx}
                      className="grid gap-4 items-center grid-cols-1 md:grid-cols-3"
                    >
                      <input
                        type="text"
                        value={item.nama ?? ""}
                        onChange={(e) => {
                          const updated = [...monitoring];
                          updated[monIdx].items[itemIdx].nama = e.target.value;
                          setMonitoring(updated);
                        }}
                        className="border px-3 py-2 rounded w-full focus:outline-none focus:ring-1 focus:ring-yellow-400"
                        placeholder="Nama Item"
                      />

                      <input
                        type="text"
                        value={item.hasil}
                        onChange={(e) =>
                          handleItemChange(monIdx, itemIdx, e.target.value)
                        }
                        className="border px-3 py-2 rounded w-full text-left focus:outline-none focus:ring-1 focus:ring-yellow-400"
                        placeholder="Hasil Perbandingan"
                      />

                      <button
                        type="button"
                        className="bg-red-100 text-red-700 px-3 py-2 rounded text-xs hover:bg-red-200 transition w-full md:w-auto"
                        onClick={() => handleRemoveItem(monIdx, itemIdx)}
                        disabled={mon.items.length === 1}
                      >
                        Hapus
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded text-sm mt-2 hover:bg-yellow-200 transition"
                    onClick={() => handleAddItem(monIdx)}
                  >
                    + Tambah Item
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col md:flex-row justify-end gap-3 pt-4">
            <button
              type="submit"
              className="bg-yellow-500 text-white px-6 py-2 rounded hover:bg-yellow-600 transition w-full md:w-auto"
            >
              Simpan Perbandingan
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-600 hover:underline w-full md:w-auto"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
