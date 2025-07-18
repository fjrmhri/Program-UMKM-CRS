import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { ref, onValue, remove } from "firebase/database";

export default function Dashboard({ onAdd, onView }) {
  const [datasets, setDatasets] = useState([]);

  useEffect(() => {
    const q = ref(db, "datasets");
    return onValue(q, (snapshot) => {
      const data = snapshot.val() || {};
      const arr = Object.entries(data).map(([id, val]) => ({ id, ...val }));
      arr.sort((a, b) => b.createdAt - a.createdAt);
      setDatasets(arr);
    });
  }, []);

  const handleDelete = (id) => {
    if (confirm("Yakin hapus data ini?")) {
      remove(ref(db, `datasets/${id}`));
    }
  };

  return (
    <div className="p-4 bg-white shadow rounded">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Data Pre-Post Test</h2>
        <button
          onClick={onAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Tambah Data
        </button>
      </div>

      {datasets.length === 0 ? (
        <p className="text-gray-500 text-sm">Belum ada data.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border rounded">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-2 text-left">Judul</th>
                <th className="px-3 py-2 text-left">Pre</th>
                <th className="px-3 py-2 text-left">Post</th>
                <th className="px-3 py-2 text-left">Peserta</th>
                <th className="px-3 py-2 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {datasets.map((d) => (
                <tr key={d.id} className="border-t">
                  <td className="px-3 py-2">{d.title}</td>
                  <td className="px-3 py-2">
                    {new Date(d.preDate).toLocaleDateString("id-ID")}
                  </td>
                  <td className="px-3 py-2">
                    {new Date(d.postDate).toLocaleDateString("id-ID")}
                  </td>
                  <td className="px-3 py-2">{d.raw?.length || 0}</td>
                  <td className="px-3 py-2 space-x-2">
                    <button
                      onClick={() => onView(d)}
                      className="text-blue-600 hover:underline"
                    >
                      Detail
                    </button>
                    <button
                      onClick={() => handleDelete(d.id)}
                      className="text-red-500 hover:underline"
                    >
                      Hapus
                    </button>
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
