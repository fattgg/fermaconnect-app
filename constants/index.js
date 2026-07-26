export const API_URL = "https://fermaconnect-api.onrender.com/api";

export const CATEGORIES = [
  { label: "all", value: "" },
  { label: "vegetables", value: "vegetables" },
  { label: "fruits", value: "fruits" },
  { label: "dairy", value: "dairy" },
  { label: "meat", value: "meat" },
  { label: "honey", value: "honey" },
  { label: "eggs", value: "eggs" },
  { label: "grains", value: "grains" },
  { label: "herbs", value: "herbs" },
  { label: "other", value: "other" },
];

export const MUNICIPALITIES = [
  "Pristina",
  "Prizren",
  "Peja",
  "Gjakova",
  "Gjilan",
  "Mitrovica",
  "Ferizaj",
  "Podujeva",
  "Vushtrri",
  "Suhareka",
  "Rahovec",
  "Drenas",
  "Lipjan",
  "Malisheva",
  "Kamenica",
];

export const MUNICIPALITY_COORDS = {
  Pristina: { lat: 42.6629, lon: 21.1655 },
  Prizren: { lat: 42.2139, lon: 20.7397 },
  Peja: { lat: 42.66, lon: 20.2883 },
  Gjakova: { lat: 42.3803, lon: 20.4308 },
  Gjilan: { lat: 42.4638, lon: 21.4694 },
  Mitrovica: { lat: 42.8914, lon: 20.866 },
  Ferizaj: { lat: 42.3702, lon: 21.1553 },
  Podujeva: { lat: 42.911, lon: 21.193 },
  Vushtrri: { lat: 42.8231, lon: 20.9675 },
  Suhareka: { lat: 42.3589, lon: 20.8256 },
  Rahovec: { lat: 42.3994, lon: 20.6547 },
  Drenas: { lat: 42.6272, lon: 20.8939 },
  Lipjan: { lat: 42.5217, lon: 21.1258 },
  Malisheva: { lat: 42.4828, lon: 20.7458 },
  Kamenica: { lat: 42.5786, lon: 21.58 },
};

export const KOSOVO_REGION = {
  latitude: 42.5833,
  longitude: 20.9,
  latitudeDelta: 1.4,
  longitudeDelta: 1.4,
};

export const ORDER_STATUS_COLORS = {
  pending: "#F4A261",
  accepted: "#52B788",
  rejected: "#E63946",
  completed: "#2D6A4F",
};

export const ORDER_STATUS_LABELS = {
  pending: "Pending",
  accepted: "Accepted",
  rejected: "Rejected",
  completed: "Completed",
};
