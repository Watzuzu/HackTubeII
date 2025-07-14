import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const ConfirmEmail = () => {
  const [searchParams] = useSearchParams();
  const [msg, setMsg] = useState("Confirmation en cours...");

  useEffect(() => {
    const token = searchParams.get("token");
    fetch(`https://hacktube.fr/api/confirm?token=${token}`)
      .then(res => res.json())
      .then(data => setMsg(data.message));
  }, [searchParams]);

  return <div className="text-center mt-10">{msg}</div>;
};

export default ConfirmEmail;