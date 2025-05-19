import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { startOrGetChatRoom } from '../../APIS/API';
import { Loader2 } from 'lucide-react';

const StartChatButton = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleStartChat = async () => {
    setLoading(true);


    try {
     
        navigate(`/messages`);
      
    }catch(err){
          console.error('Chat initiation failed', err);
    }finally {
      setLoading(false);
    }


    // Optimistically navigate to a temporary chat loader view
   // const tempRoomId = `loading-${Date.now()}`;
    //navigate(`/messages/${tempRoomId}`, { state: { loading: true } });

    /*try {
      const res = await startOrGetChatRoom({ userId2, jobId });
      if (res.status === 200) {
        navigate(`/messages/${res.data._id}`,{ replace: true });
      } else {
        throw new Error('Room creation failed');
      }
    } catch (err) {
      console.error('Chat initiation failed', err);
      navigate('/messages'); // fallback to messages page
    } finally {
      setLoading(false);
    }*/
  };

  return (
    <button
      className={`flex items-center gap-2 px-4 py-2 rounded text-white transition-all ${
        loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
      }`}
      onClick={handleStartChat}
      disabled={loading}
    >
      {loading ? (
        <>
          <Loader2 className="animate-spin" size={18} />
          Starting...
        </>
      ) : (
        'Send a Chat'
      )}
    </button>
  );
};

export default StartChatButton;
