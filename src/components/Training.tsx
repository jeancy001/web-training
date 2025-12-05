import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_URL } from "../constants/API_URL";

interface Receipt {
  _id: string;
  name: string;
  email: string;
  phone: string;
  receiptNumber: string;
  amount: number;
  currency: string;
  notes?: string;
  date: string;
}

interface TokenPayload {
  id: string;
  email: string;
  role: string;
}

function Training() {
  /* -------------------- STATES -------------------- */
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    amount: 10000,
    currency: "CDF",
    notes: "",
  });

  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [receiptId, setReceiptId] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading , setLoading] =useState<boolean>(false)

  /* -------------------- FETCH RECEIPTS -------------------- */
  const fetchReceipts = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/receipt`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      const data = Array.isArray(response.data)
        ? response.data
        : response.data.receipts
        ? response.data.receipts
        : [];

      setReceipts(data);
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors du chargement des reçus.");
    }
  };

  useEffect(() => {
    fetchReceipts();
  }, [token]);

  /* -------------------- INPUT HANDLERS -------------------- */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  };

  /* -------------------- CREATE RECEIPT -------------------- */
  const handleSubmit = async () => {
        setLoading(true)
    try {
  
      const receiptNumber = `RCPT-${Date.now()}`;

      const response = await axios.post(
        `${API_URL}/api/receipt`,
        { ...form, amount: 10000, receiptNumber },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
   
      setReceiptId(response.data._id);
      fetchReceipts();
      toast.success(`Reçu créé avec succès : ${receiptNumber}`);
          setLoading(false)
    } catch (error) {
      console.error(error);
     
      toast.error("Erreur lors de la création du reçu.");
       setLoading(false)
    }
  };

  /* -------------------- LOGIN -------------------- */
  const handleAdminLogin = async () => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/admin/login`, loginForm);
      localStorage.setItem("token", response.data.token);
      setToken(response.data.token);

      const decoded = jwtDecode<TokenPayload>(response.data.token);
      setIsAdmin(decoded.role === "admin");
      setShowLogin(false);
      toast.success("Connexion réussie ! Vous êtes maintenant admin.");
    } catch (error) {
      console.error(error);
      toast.error("Email ou mot de passe incorrect.");
    }
  };

  /* -------------------- PRINT FUNCTIONS -------------------- */
  const printPDF = async (id: string) => {
    if (!token || !isAdmin) {
      setShowLogin(true);
      toast.info("Connexion admin requise pour télécharger le reçu.");
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/api/receipt/print/${id}`, {
        responseType: "blob",
        headers: { Authorization: `Bearer ${token}` },
      });

      const fileURL = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = fileURL;
      link.download = `ticket_${id}.pdf`;
      link.click();
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors du téléchargement du PDF.");
    }
  };

  const printAllReceipts = async () => {
    if (!token || !isAdmin) {
      setShowLogin(true);
      toast.info("Connexion admin requise pour imprimer tous les reçus.");
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/api/receipt/printAll`, {
        responseType: "blob",
        headers: { Authorization: `Bearer ${token}` },
      });

      const fileURL = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = fileURL;
      link.download = `all_receipts.pdf`;
      link.click();
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de l'impression de tous les reçus.");
    }
  };

  /* -------------------- UI -------------------- */
  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <ToastContainer position="top-right" autoClose={4000} />
      <h1 className="text-4xl font-bold mb-6 text-center text-red-700">
        🎟️ Reçu Officiel de Formation — JeancyTech
      </h1>

      {/* PAYMENT INFO */}
      <div className="bg-yellow-100 border-l-4 border-red-600 p-4 rounded mb-8">
        <p className="text-red-700 font-semibold">
          ℹ️ Informations importantes pour le participant :
        </p>
        <ul className="list-disc list-inside text-gray-700 mt-2">
          <li>Le reçu nécessaire est de <strong>10 000 CDF</strong> pour l'inscription.</li>
          <li>Chaque formation additionnelle coûte <strong>2 000 CDF</strong> par session.</li>
          <li>Conservez ce reçu pour accéder aux formations et pour toute vérification.</li>
        </ul>
      </div>

      {/* FORM */}
      <div className="bg-white shadow-xl rounded-2xl p-8 border border-red-200">
        <h2 className="text-2xl font-semibold text-red-700 mb-6">
          ➤ Informations du Participant
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            name="name"
            placeholder="Nom complet"
            onChange={handleChange}
            className="border p-3 rounded-lg focus:ring-2 focus:ring-red-500"
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            className="border p-3 rounded-lg focus:ring-2 focus:ring-red-500"
          />
          <input
            name="phone"
            placeholder="Téléphone"
            onChange={handleChange}
            className="border p-3 rounded-lg focus:ring-2 focus:ring-red-500"
          />
          <textarea
            name="notes"
            placeholder="Notes (optionnel)"
            rows={1}
            onChange={handleChange}
            className="border p-3 rounded-lg focus:ring-2 focus:ring-red-500 col-span-full"
          />
        </div>

        <div className="flex flex-col md:flex-row gap-4 mt-8">
          <button
            onClick={handleSubmit}
            className="bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 flex-1"
          >
            {loading? "Enregistrement...":"➕ Enregistrer le Reçu"}
          </button>

          {receiptId && (
            <button
              onClick={() => printPDF(receiptId)}
              className="bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 flex-1"
            >
              {loading?"Pression..." : "📄 Télécharger le Ticket"}
            </button>
          )}

          <button
            onClick={printAllReceipts}
            className="bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 flex-1 mt-2 md:mt-0"
          >
            🖨️ Imprimer Tous les Reçus
          </button>
        </div>
      </div>

      {/* LOGIN MODAL */}
      {showLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-xl">
            <h2 className="text-2xl font-bold text-red-700 mb-4 text-center">
              🔑 Connexion Admin Requise
            </h2>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={loginForm.username}
              onChange={handleLoginChange}
              className="border p-3 rounded-lg w-full mb-4 focus:ring-2 focus:ring-red-500"
            />
            <input
              type="password"
              name="password"
              placeholder="Mot de passe"
              value={loginForm.password}
              onChange={handleLoginChange}
              className="border p-3 rounded-lg w-full mb-6 focus:ring-2 focus:ring-red-500"
            />
            <button
              onClick={handleAdminLogin}
              className="bg-red-600 text-white py-3 rounded-lg font-semibold w-full hover:bg-red-700"
            >
              {loading? "Connexion..." :"🔓 Se Connecter"}
            </button>
          </div>
        </div>
      )}

      {/* RECEIPTS LIST */}
      <h2 className="text-3xl font-bold text-center text-red-700 mt-12 mb-4">
        📋 Liste des Reçus
      </h2>

      <div className="overflow-x-auto shadow-xl rounded-xl">
        <table className="w-full bg-white rounded-xl">
          <thead>
            <tr className="bg-red-700 text-white text-center">
              <th className="py-3">Nom</th>
              <th className="py-3">Email</th>
              <th className="py-3">Téléphone</th>
              <th className="py-3">Numéro</th>
              <th className="py-3">Date</th>
              <th className="py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {receipts.map((r) => (
              <tr key={r._id} className="border text-center">
                <td className="py-2">{r.name}</td>
                <td>{r.email}</td>
                <td>{r.phone}</td>
                <td className="text-red-700 font-bold">{r.receiptNumber}</td>
                <td>{new Date(r.date).toLocaleDateString("fr-FR")}</td>
                <td>
                  {isAdmin ? (
                    <button
                      onClick={() => printPDF(r._id)}
                      className="bg-green-600 text-white py-1 px-3 rounded hover:bg-green-700"
                    >
                      PDF
                    </button>
                  ) : (
                    <button
                      onClick={() => { setShowLogin(true); toast.info("Connexion admin requise."); }}
                      className="bg-gray-400 text-white py-1 px-3 rounded cursor-not-allowed"
                    >
                      🔒 Accès Admin
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {receipts.length === 0 && (
              <tr>
                <td colSpan={6} className="py-4 text-center">
                  Aucun reçu trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Training;
