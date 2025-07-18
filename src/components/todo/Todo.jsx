import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { ref, onValue, set, remove } from "firebase/database";
import { v4 as uuidv4 } from "uuid";

export default function Todo() {
  const [todos, setTodos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [date, setDate] = useState("");
  const [link, setLink] = useState("");
  const [filterDate, setFilterDate] = useState("");

  useEffect(() => {
    const q = ref(db, "todos");
    return onValue(q, (snapshot) => {
      const data = snapshot.val() || {};
      const list = Object.entries(data).map(([id, val]) => ({ id, ...val }));
      list.sort((a, b) => b.createdAt - a.createdAt);
      setTodos(list);
    });
  }, []);

  const handleDelete = (id) => {
    if (confirm("Hapus to‑do ini?")) {
      remove(ref(db, `todos/${id}`));
    }
  };

  const openModal = (todo = null) => {
    if (todo) {
      setEditingId(todo.id);
      setTitle(todo.title);
      setText(todo.text);
      setDate(todo.date);
      setLink(todo.link);
    } else {
      setEditingId(null);
      setTitle("");
      setText("");
      setDate("");
      setLink("");
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !text.trim() || !date)
      return alert("Semua field wajib diisi!");

    const id = editingId || uuidv4();
    const todoObj = {
      title,
      text,
      date,
      link,
      createdAt: editingId
        ? todos.find((t) => t.id === id).createdAt
        : Date.now(),
      done: editingId ? todos.find((t) => t.id === id).done : false,
    };

    try {
      await set(ref(db, `todos/${id}`), todoObj);
      setShowModal(false);
    } catch (err) {
      alert("Gagal menyimpan to-do!");
    }
  };

  const toggleDone = async (todo) => {
    await set(ref(db, `todos/${todo.id}`), { ...todo, done: !todo.done });
  };

  const filtered = filterDate
    ? todos.filter((t) => t.date === filterDate)
    : todos;

  return (
    <div className="p-4 bg-white shadow rounded space-y-4">
      {}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Daftar To‑Do</h2>
        <button
          onClick={() => openModal()}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Tambah Data
        </button>
      </div>

      {}
      <div className="flex items-center gap-4">
        <label className="font-medium">Filter tanggal:</label>
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="border px-2 py-1 rounded"
        />
        {filterDate && (
          <button
            onClick={() => setFilterDate("")}
            className="text-sm text-red-500 hover:underline"
          >
            Reset filter
          </button>
        )}
      </div>

      {}
      {filtered.length === 0 ? (
        <p className="text-gray-500 text-sm">Belum ada to‑do.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border rounded">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-2 text-left">Status</th>
                <th className="px-3 py-2 text-left">Judul</th>
                <th className="px-3 py-2 text-left">Tanggal</th>
                <th className="px-3 py-2 text-left">Link</th>
                <th className="px-3 py-2 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((todo) => (
                <tr
                  key={todo.id}
                  className={`border-t ${todo.done ? "bg-gray-100" : ""}`}
                >
                  <td className="px-3 py-2">
                    <input
                      type="checkbox"
                      checked={todo.done || false}
                      onChange={() => toggleDone(todo)}
                    />
                  </td>
                  <td className="px-3 py-2">{todo.title}</td>
                  <td className="px-3 py-2">
                    {new Date(todo.date).toLocaleDateString()}
                  </td>
                  <td className="px-3 py-2">
                    {todo.link ? (
                      <a
                        href={todo.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        di sini
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="px-3 py-2 space-x-2">
                    <button
                      onClick={() => openModal(todo)}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(todo.id)}
                      className="text-red-500 hover:underline text-sm"
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

      {}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded shadow-lg w-full max-w-lg space-y-4"
          >
            <h2 className="text-xl font-bold">
              {editingId ? "Edit To‑Do" : "Tambah Data"}
            </h2>

            <div>
              <label className="block mb-1 font-medium">Judul</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border px-3 py-2 rounded"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Isi To‑Do</label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full border px-3 py-2 rounded min-h-[80px]"
                required
              ></textarea>
            </div>

            <div>
              <label className="block mb-1 font-medium">Tanggal</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border px-3 py-2 rounded"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Link (Opsional)</label>
              <input
                type="url"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className="w-full border px-3 py-2 rounded"
              />
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Simpan
              </button>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-gray-600 hover:underline"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
