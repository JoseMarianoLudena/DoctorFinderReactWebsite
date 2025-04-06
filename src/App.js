import React, { useState } from 'react';
import './App.css';

const doctorsData = [
  {
    id: 1,
    type: 'Cardiologist',
    name: 'Dr. John Smith',
    location: 'New York',
    photo: 'https://randomuser.me/api/portraits/men/1.jpg',
    experience: '15 years',
    description: 'Specializes in heart disease prevention and treatment.',
    reviews: ['Great doctor, very thorough! - Jane D.', 'Helped me recover quickly. - Mark S.'],
  },
  {
    id: 2,
    type: 'Pediatrician',
    name: 'Dr. Emily Brown',
    location: 'Los Angeles',
    photo: 'https://randomuser.me/api/portraits/women/2.jpg',
    experience: '10 years',
    description: 'Expert in child healthcare and development.',
    reviews: ['Wonderful with kids! - Sarah L.', 'Very patient. - Tom R.'],
  },
  {
    id: 3,
    type: 'Neurologist',
    name: 'Dr. Alan Green',
    location: 'Chicago',
    photo: 'https://randomuser.me/api/portraits/men/3.jpg',
    experience: '20 years',
    description: 'Focuses on neurological disorders and brain health.',
    reviews: ['Highly knowledgeable. - Lisa P.', 'Explains everything well. - Mike T.'],
  },
  {
    id: 4,
    type: 'Dermatologist',
    name: 'Dr. Sarah Lee',
    location: 'Houston',
    photo: 'https://randomuser.me/api/portraits/women/4.jpg',
    experience: '8 years',
    description: 'Skilled in skin conditions and cosmetic procedures.',
    reviews: ['Fixed my acne! - Emily K.', 'Professional and kind. - John W.'],
  },
  {
    id: 5,
    type: 'Orthopedist',
    name: 'Dr. Michael Chen',
    location: 'Miami',
    photo: 'https://randomuser.me/api/portraits/men/5.jpg',
    experience: '12 years',
    description: 'Specializes in bone and joint injuries.',
    reviews: ['Great surgeon! - Alex B.', 'Very attentive. - Rachel M.'],
  },
  {
    id: 6,
    type: 'Gynecologist',
    name: 'Dr. Lisa Patel',
    location: 'Seattle',
    photo: 'https://randomuser.me/api/portraits/women/6.jpg',
    experience: '14 years',
    description: 'Expert in women’s reproductive health.',
    reviews: ['Made me feel comfortable. - Priya S.', 'Highly recommend! - Laura G.'],
  },
  {
    id: 7,
    type: 'Psychiatrist',
    name: 'Dr. David Kim',
    location: 'Boston',
    photo: 'https://randomuser.me/api/portraits/men/7.jpg',
    experience: '18 years',
    description: 'Focuses on mental health and therapy.',
    reviews: ['Life-changing sessions. - Chris H.', 'Very empathetic. - Anna J.'],
  },
  {
    id: 8,
    type: 'Oncologist',
    name: 'Dr. Rachel Adams',
    location: 'Denver',
    photo: 'https://randomuser.me/api/portraits/women/8.jpg',
    experience: '11 years',
    description: 'Specializes in cancer treatment and care.',
    reviews: ['Compassionate care. - Peter C.', 'Explained options clearly. - Linda F.'],
  },
  {
    id: 9,
    type: 'Endocrinologist',
    name: 'Dr. James Carter',
    location: 'Phoenix',
    photo: 'https://randomuser.me/api/portraits/men/9.jpg',
    experience: '16 years',
    description: 'Manages hormonal and metabolic disorders.',
    reviews: ['Helped my thyroid issue. - Maria V.', 'Very thorough. - Sam N.'],
  },
  {
    id: 10,
    type: 'Urologist',
    name: 'Dr. Olivia White',
    location: 'San Francisco',
    photo: 'https://randomuser.me/api/portraits/women/10.jpg',
    experience: '9 years',
    description: 'Expert in urinary tract and male reproductive health.',
    reviews: ['Quick diagnosis. - Kevin O.', 'Friendly and professional. - Julia B.'],
  },
];

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [doctors, setDoctors] = useState(doctorsData);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]); // Store full conversation
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = doctorsData.filter(
      (doctor) =>
        doctor.type.toLowerCase().includes(term) ||
        doctor.name.toLowerCase().includes(term) ||
        doctor.location.toLowerCase().includes(term)
    );
    setDoctors(filtered);
  };

  const sendChatMessage = async () => {
    if (!chatMessage.trim()) return; // Prevent empty messages
    try {
      // Add user's message to history
      setChatHistory((prev) => [...prev, { sender: 'You', text: chatMessage }]);
      
      const res = await fetch('http://localhost:5000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: chatMessage }),
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      
      // Add bot's response to history
      setChatHistory((prev) => [...prev, { sender: 'Bot', text: data.response }]);
      setChatMessage(''); // Clear input
    } catch (error) {
      console.error('Chat error:', error);
      setChatHistory((prev) => [
        ...prev,
        { sender: 'Bot', text: 'Sorry, there was an error connecting to the chatbot.' },
      ]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && chatMessage.trim()) {
      sendChatMessage();
    }
  };

  const openDoctorDetails = (doctor) => {
    setSelectedDoctor(doctor);
  };

  const closeDoctorDetails = () => {
    setSelectedDoctor(null);
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div className="App">
      <h1>Doctor Finder</h1>
      <input
        type="text"
        placeholder="Search by type, name, or location..."
        value={searchTerm}
        onChange={handleSearch}
        className="search-bar"
      />
      <div className="doctor-cards">
        {doctors.map((doctor) => (
          <div
            key={doctor.id}
            className="doctor-card"
            onClick={() => openDoctorDetails(doctor)}
          >
            <img src={doctor.photo} alt={doctor.name} className="doctor-photo" />
            <div className="doctor-info">
              <h3>{doctor.type}</h3>
              <p>{doctor.name}</p>
              <p>{doctor.location}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Chatbot Widget */}
      <div className={`chat-widget ${isChatOpen ? 'open' : ''}`}>
        {isChatOpen ? (
          <div className="chat-container">
            <div className="chat-header">
              <h2>Baymax</h2>
              <button className="chat-close" onClick={toggleChat}>×</button>
            </div>
            <div className="chat-history">
              {chatHistory.map((msg, index) => (
                <div
                  key={index}
                  className={`chat-message ${msg.sender === 'You' ? 'user' : 'bot'}`}
                >
                  <span className="sender">{msg.sender}:</span> {msg.text}
                </div>
              ))}
            </div>
            <div className="chat-input">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about doctors or schedules..."
              />
              <button onClick={sendChatMessage}>Send</button>
            </div>
          </div>
        ) : (
          <button className="chat-toggle" onClick={toggleChat}>
            Chat
          </button>
        )}
      </div>

      {/* Doctor Details Modal */}
      {selectedDoctor && (
        <div className="modal-overlay" onClick={closeDoctorDetails}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeDoctorDetails}>
              ×
            </button>
            <img src={selectedDoctor.photo} alt={selectedDoctor.name} className="modal-photo" />
            <h2>{selectedDoctor.name}</h2>
            <p><strong>Type:</strong> {selectedDoctor.type}</p>
            <p><strong>Location:</strong> {selectedDoctor.location}</p>
            <p><strong>Experience:</strong> {selectedDoctor.experience}</p>
            <p><strong>About:</strong> {selectedDoctor.description}</p>
            <h3>Reviews</h3>
            <ul className="reviews-list">
              {selectedDoctor.reviews.map((review, index) => (
                <li key={index}>{review}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;