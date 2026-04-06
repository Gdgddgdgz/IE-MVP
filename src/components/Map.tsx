'use client';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';

// Fix for default marker icon in Next.js
let DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function Map({ center = [51.505, -0.09], role = 'family', roomCode = 'room_123' }: { center?: any, role?: string, roomCode?: string }) {
  const [caregiverLocation, setCaregiverLocation] = useState(center);
  const socketRef = useRef<any>(null);

  useEffect(() => {
    socketRef.current = io();
    socketRef.current.emit('join_room', roomCode);

    socketRef.current.on('location_update', (data: any) => {
      setCaregiverLocation([data.lat, data.lng]);
    });

    let interval: NodeJS.Timeout;
    if (role === 'caregiver') {
      interval = setInterval(() => {
        setCaregiverLocation((prev: any[]) => {
          const newLat = prev[0] + (Math.random() - 0.5) * 0.001;
          const newLng = prev[1] + (Math.random() - 0.5) * 0.001;
          socketRef.current.emit('location_update', { roomId: roomCode, lat: newLat, lng: newLng });
          return [newLat, newLng];
        });
      }, 5000);
    }

    return () => {
      if (interval) clearInterval(interval);
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [role, roomCode]);

  return (
    <div style={{ height: '400px', width: '100%', borderRadius: '12px', overflow: 'hidden', border: '2px solid var(--primary-green)', zIndex: 0 }}>
      <MapContainer center={caregiverLocation} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%', zIndex: 0 }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={caregiverLocation}>
          <Popup>Caregiver Current Location ({roomCode})</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
