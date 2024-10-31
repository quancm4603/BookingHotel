import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Button, // Nhập Button từ React Native
} from "react-native";
import { db } from "@/firebaseConfig";
import { collection, GeoPoint, getDocs } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native"; // Nhập useNavigation
import { Link } from "expo-router";

interface Room {
  id: string;
  name: string;
  image: string;
  amenities: string[];
  pricePerHour: number;
  privePerNight: number;
  location: GeoPoint;
  option: boolean;
}

const RoomList: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigation = useNavigation(); // Khởi tạo navigation

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const roomsCollection = collection(db, "rooms");
        const roomSnapshot = await getDocs(roomsCollection);
        if (roomSnapshot.docs) {
          setRooms(
            roomSnapshot.docs.map((doc) => ({
              id: doc.id,
              image: doc.get("image"),
              name: doc.get("name"),
              amenities: doc.get("amenities"),
              pricePerHour: doc.get("pricePerHour"),
              privePerNight: doc.get("privePerNight"),
              location: doc.get("location"),
              option: doc.get("option"),
            }))
          );
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching rooms: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      {rooms.map((room) => (
        <View key={room.id} style={styles.card}>
          <Image source={{ uri: room.image }} style={styles.cardImage} />
          <View style={styles.cardContent}>
            <Text style={styles.cardText}>Room ID: {room.id}</Text>
            <Text style={styles.cardText}>Name: {room.name}</Text>
            <Text style={styles.cardText}>
              Amenities: {room.amenities.join(", ")}
            </Text>
            <Text style={styles.cardText}>
              Price per hour: {room.pricePerHour}
            </Text>
            <Text style={styles.cardText}>
              Price per night: {room.privePerNight}
            </Text>
            <Text style={styles.cardText}>
              Location: {room.location.latitude}, {room.location.longitude}
            </Text>
            <Text style={styles.cardText}>
              Option: {room.option ? "Yes" : "No"}
            </Text>
            {/* Nút Booking */}
            {/* <Link
              href={{
                pathname: "/booking[slug]",
                params: { slug: '/' + room.id.toString() },
              }}
            >
              Book now
            </Link> */}
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  card: {
    marginBottom: 16,
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    overflow: "hidden", // Giúp giữ các góc của card được mượt mà
  },
  cardImage: {
    width: "100%",
    height: 150,
    borderRadius: 8,
  },
  cardContent: {
    padding: 8,
  },
  cardText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333", // Màu chữ tối hơn
    marginTop: 4,
  },
});

export default RoomList;
