import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    if (isRegister) {
      if (form.password !== form.confirm) {
        setMsg("Les mots de passe ne correspondent pas !");
        setLoading(false);
        return;
      }
      // Appel API pour créer un compte
      try {
        const res = await fetch("http://192.168.1.112:5000/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: form.email, password: form.password }),
          credentials: "include", // Ajouté ici aussi
        });
        const data = await res.json();
        setMsg(data.message);
        if (data.success) setIsRegister(false);
      } catch {
        setMsg("Erreur réseau.");
      }
      setLoading(false);
    } else {
      // Appel API pour se connecter
      try {
        const res = await fetch("http://192.168.1.112:5000/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: form.email, password: form.password }),
          credentials: "include", // Ajouté ici
        });
        const data = await res.json();
        setMsg(data.message);
        if (data.success) {
          navigate("/account"); // Redirection propre
          window.location.reload(); // Ajoute ceci pour forcer le header à se remonter
        }
      } catch {
        setMsg("Erreur réseau.");
      }
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 min-h-screen">
      <div className="bg-base-200 p-8 rounded shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-4 text-center">
          {isRegister ? "Créer un compte" : "Connexion"}
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="input input-bordered"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Mot de passe"
            className="input input-bordered"
            value={form.password}
            onChange={handleChange}
            required
          />
          {isRegister && (
            <input
              type="password"
              name="confirm"
              placeholder="Confirmer le mot de passe"
              className="input input-bordered"
              value={form.confirm}
              onChange={handleChange}
              required
            />
          )}
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading
              ? "Veuillez patienter..."
              : isRegister
              ? "Créer un compte"
              : "Se connecter"}
          </button>
        </form>
        {msg && (
          <div className="mt-4 text-center text-sm text-red-500">{msg}</div>
        )}
        <button
          className="btn btn-link mt-4"
          onClick={() => {
            setIsRegister((v) => !v);
            setMsg("");
          }}
        >
          {isRegister
            ? "Déjà un compte ? Se connecter"
            : "Créer un compte"}
        </button>
      </div>
    </div>
  );
};

export default Login;