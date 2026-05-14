const { initializeApp } = require("firebase/app");
const { getFirestore, collection, getDocs, updateDoc, doc } = require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyC6OCQCstDOI2KtL35kzSEMqOtgZ7xMxTQ",
  authDomain: "bytour-6b314.firebaseapp.com",
  projectId: "bytour-6b314",
  storageBucket: "bytour-6b314.firebasestorage.app",
  messagingSenderId: "1026453791267",
  appId: "1:1026453791267:web:d181862cfdfe5c0ae70796",
  measurementId: "G-GG1GXS1K6V"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function fixData() {
  console.log("Fixing room IDs and Prices...");
  const hotelsCol = collection(db, "hotels");
  const snapshot = await getDocs(hotelsCol);
  
  for (const hotelDoc of snapshot.docs) {
    const hotel = hotelDoc.data();
    let changed = false;
    
    if (hotel.roomTypes) {
      const updatedRooms = hotel.roomTypes.map((room, idx) => {
        let updatedRoom = { ...room };
        
        if (!room.id) {
          changed = true;
          updatedRoom.id = Math.random().toString(36).substr(2, 9);
        }
        
        // Convert price to number
        if (typeof room.price === "string") {
          changed = true;
          updatedRoom.price = parseFloat(room.price) || 0;
        }
        
        return updatedRoom;
      });
      
      if (changed) {
        await updateDoc(doc(db, "hotels", hotelDoc.id), {
          roomTypes: updatedRooms
        });
        console.log(`Updated hotel: ${hotel.nameTR || hotelDoc.id}`);
      }
    }
  }
  console.log("Done!");
  process.exit(0);
}

fixData();
