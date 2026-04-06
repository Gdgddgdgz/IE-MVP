'use client';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';

let DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Child component to automatically pan the map when location updates
function LocationMarker({ position }: { position: any }) {
  const map = useMap();
  useEffect(() => {
     if(position) map.flyTo(position, map.getZoom(), { duration: 1.5 });
  }, [position, map]);
  return position === null ? null : (
    <Marker position={position}>
      <Popup>Caregiver Location</Popup>
    </Marker>
  );
}

export default function Map({ center = [51.505, -0.09], role = 'family', roomCode = 'room_123' }: { center?: any, role?: string, roomCode?: string }) {
  const [caregiverLocation, setCaregiverLocation] = useState(center);
  const socketRef = useRef<any>(null);

  useEffect(() => {
    socketRef.current = io();
    socketRef.current.emit('join_room', roomCode);

    socketRef.current.on('location_update', (data: any) => {
      setCaregiverLocation([data.lat, data.lng]);
    });

    let watchId: number;
    if (role === 'caregiver') {
      if ('geolocation' in navigator) {
        watchId = navigator.geolocation.watchPosition((position) => {
          const newLat = position.coords.latitude;
          const newLng = position.coords.longitude;
          setCaregiverLocation([newLat, newLng]);
          socketRef.current.emit('location_update', { roomId: roomCode, lat: newLat, lng: newLng });
        }, (error) => {
          console.error("Error watching location: ", error.message);
        }, { enableHighAccuracy: true });
      } else {
        alert("Geolocation is not supported by your browser");
      }
    }

    return () => {
      if (watchId && navigator.geolocation) navigator.geolocation.clearWatch(watchId);
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [role, roomCode]);

  return (
    <div style={{ height: '400px', width: '100%', borderRadius: '12px', overflow: 'hidden', border: '2px solid var(--primary-green)', zIndex: 0 }}>
      <MapContainer center={caregiverLocation} zoom={15} scrollWheelZoom={false} style={{ height: '100%', width: '100%', zIndex: 0 }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker position={caregiverLocation} />
      </MapContainer>
    </div>
  );
}
