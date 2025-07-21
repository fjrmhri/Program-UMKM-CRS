import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { ref, onValue, remove } from "firebase/database";

export default function DashboardMSE({
  onAddForm,
  onAddUpload,
  onView,
  onCompare,
}) {
  const [datasets, setDatasets] = useState([]);

  useEffect(() => {
    const q = ref(db, "mse");
    return onValue(q, (snapshot) => {
      const data = snapshot.val() || {};
      const arr = Object.entries(data).map(([id, val]) => ({ id, ...val }));
      arr.sort((a, b) => b.createdAt - a.createdAt);
      setDatasets(arr);
    });
  }, []);

  const handleDelete = (id) => {
    if (confirm("Yakin hapus data ini?")) {
      remove(ref(db, `mse/${id}`));
    }
  };

  return (
    <div className="p-1 sm:p-2 md:p-4 bg-white shadow rounded">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 sm:mb-3 gap-2">
        <h2 className="text-base sm:text-lg md:text-xl font-semibold">
          Monitoring MSE Offline
        </h2>
        <div className="flex gap-2">
          <button
            onClick={onAddForm}
            className="bg-green-600 text-white px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 rounded text-xs sm:text-sm md:text-base hover:bg-green-700 transition"
          >
            + Input Manual
          </button>
          <button
            onClick={onAddUpload}
            className="bg-green-600 text-white px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 rounded text-xs sm:text-sm md:text-base hover:bg-green-700 transition"
          >
            + Upload Excel
          </button>
        </div>
      </div>
      {datasets.length === 0 ? (
        <p className="text-gray-500 text-xs sm:text-sm">Belum ada data.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-[340px] sm:min-w-[600px] w-full text-xs sm:text-sm border rounded">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-2 py-2 text-left">Nama UMKM</th>
                <th className="px-2 py-2 text-left">Usaha/Produk</th>
                <th className="px-2 py-2 text-left">Desa</th>
                <th className="px-2 py-2 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {datasets.map((d) => (
                <tr key={d.id} className="border-t">
                  <td className="px-2 py-2">{d.meta?.nama}</td>
                  <td className="px-2 py-2">{d.meta?.usaha}</td>
                  <td className="px-2 py-2">{d.meta?.desa}</td>

                  <td className="px-2 py-2">
                    <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
                      <button
                        onClick={() => onView(d)}
                        className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs hover:bg-blue-100 transition w-full sm:w-auto"
                      >
                        Detail
                      </button>
                      <button
                        onClick={() => handleDelete(d.id)}
                        className="bg-red-50 text-red-600 px-2 py-1 rounded text-xs hover:bg-red-100 transition w-full sm:w-auto"
                      >
                        Hapus
                      </button>
                      <button
                        onClick={() => onCompare(d)}
                        className={`px-2 py-1 rounded text-xs font-semibold transition w-full sm:w-auto ${
                          d.comparison
                            ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                            : "bg-yellow-500 text-white hover:bg-yellow-600"
                        }`}
                      >
                        {d.comparison ? "Edit Perbandingan" : "Banding"}
                      </button>
                      <button
                        onClick={() => onEdit(d)}
                        className="bg-green-50 text-green-600 px-2 py-1 rounded text-xs hover:bg-green-100 transition w-full sm:w-auto"
                      >
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
