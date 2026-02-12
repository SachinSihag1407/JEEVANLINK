import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

const LiveMap = ({ lat, lng }) => {
  if (!lat || !lng) return null;

  return (
    <div className="h-56 w-full rounded-2xl overflow-hidden">
      <MapContainer
        center={[lat, lng]}
        zoom={14}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lng]}>
          <Popup>Emergency Location</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default LiveMap;
