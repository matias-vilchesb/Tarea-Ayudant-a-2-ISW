import { useEffect, useState } from "react";
import { getProfile } from "../services/profile.service";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
  getProfile().then(data => {
    if (data.data) setProfile(data.data);
    else setError(data.message || "No autenticado");
  });
}, []);

  if (error) return <p>{error}</p>;
  if (!profile) return <p>Cargando...</p>;

  return (
    <div>
      <h2>Perfil</h2>
      <p>Email: {profile.email}</p>
      {/* Agrega más campos si los tienes */}
    </div>
  );
}