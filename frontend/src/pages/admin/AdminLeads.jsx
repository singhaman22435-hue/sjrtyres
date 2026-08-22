import { useState, useEffect } from 'react';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Users, Mail, Phone, Clock, Trash2 } from 'lucide-react';

const COLUMNS = ['Pending', 'Quoted', 'Negotiating', 'Closed', 'Shipped'];

export default function AdminLeads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005';
      const response = await axios.get(`${API_URL}/api/leads`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLeads(response.data);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateLeadStatus = async (leadId, newStatus) => {
    try {
      const token = localStorage.getItem('adminToken');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005';
      await axios.put(`${API_URL}/api/leads/${leadId}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.error('Error updating status:', error);
      fetchLeads(); // Revert on failure
    }
  };

  const deleteLead = async (leadId) => {
    if(!window.confirm('Are you sure you want to completely purge this lead?')) return;
    setLeads(leads.filter(l => l._id !== leadId));
    try {
      const token = localStorage.getItem('adminToken');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005';
      await axios.delete(`${API_URL}/api/leads/${leadId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.error('Error deleting:', error);
      fetchLeads();
    }
  };

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const newStatus = destination.droppableId;
    const lead = leads.find(l => l._id === draggableId);
    
    if (lead.status !== newStatus) {
      // Optimistic update
      setLeads(leads.map(l => l._id === draggableId ? { ...l, status: newStatus } : l));
      updateLeadStatus(draggableId, newStatus);
    }
  };

  // Group leads by column
  const groupedLeads = COLUMNS.reduce((acc, col) => {
    acc[col] = leads.filter(l => l.status === col);
    return acc;
  }, {});

  // Add any unmapped status to Pending
  leads.forEach(l => {
    if (!COLUMNS.includes(l.status)) {
      if (!groupedLeads['Pending']) groupedLeads['Pending'] = [];
      if (!groupedLeads['Pending'].find(existing => existing._id === l._id)) {
        groupedLeads['Pending'].push(l);
      }
    }
  });

  return (
    <div className="flex flex-col h-full space-y-6">
      
      {/* ── HEADER ── */}
      <div className="flex-shrink-0 pb-6 border-b border-white/10">
        <h1 className="text-3xl font-black text-white flex items-center gap-3 tracking-tight">
          <Users className="text-blue-500 w-8 h-8" /> Order & Lead Board
        </h1>
        <p className="text-white/40 mt-1 text-xs font-bold uppercase tracking-widest">Kanban board for inquiry processing</p>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
           <p className="text-white/40 text-xs font-bold uppercase tracking-widest animate-pulse">Synchronizing Leads...</p>
        </div>
      ) : (
        <div className="flex-1 overflow-x-auto pb-4 scrollbar-hide">
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex gap-6 h-full items-start min-w-max">
              {COLUMNS.map(col => (
                <div key={col} className="w-80 flex flex-col bg-[#050505] border border-white/10 rounded-3xl max-h-full overflow-hidden shadow-2xl">
                  
                  {/* Column Header */}
                  <div className="p-5 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
                    <h3 className="font-bold text-white text-sm uppercase tracking-widest">{col}</h3>
                    <span className="bg-white/10 text-white text-[10px] px-3 py-1 rounded-full font-black tracking-widest border border-white/5">
                      {groupedLeads[col].length}
                    </span>
                  </div>
                  
                  <Droppable droppableId={col}>
                    {(provided, snapshot) => (
                      <div 
                        ref={provided.innerRef} 
                        {...provided.droppableProps}
                        className={`flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide transition-colors ${snapshot.isDraggingOver ? 'bg-white/[0.02]' : ''}`}
                      >
                        {groupedLeads[col].map((lead, index) => (
                          <Draggable key={lead._id} draggableId={lead._id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`bg-white/[0.04] border border-white/10 p-5 rounded-2xl shadow-lg relative group transition-all ${snapshot.isDragging ? 'shadow-2xl shadow-blue-500/20 ring-1 ring-blue-500/50 bg-white/10' : 'hover:border-white/20 hover:bg-white/[0.06]'}`}
                                style={{ ...provided.draggableProps.style }}
                              >
                                <button 
                                  onClick={() => deleteLead(lead._id)} 
                                  className="absolute top-4 right-4 text-white/20 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity bg-black p-1.5 rounded-lg border border-white/10"
                                >
                                  <Trash2 size={14} />
                                </button>
                                
                                <div className="text-[9px] text-brand font-black uppercase tracking-[0.2em] mb-2">{lead.inquiryType}</div>
                                <div className="font-black text-white text-base leading-tight mb-3 pr-6">{lead.name}</div>
                                
                                <div className="space-y-2 mb-4">
                                  <div className="flex items-center gap-3 text-xs text-white/50">
                                    <div className="w-6 h-6 rounded-md bg-white/5 flex items-center justify-center border border-white/5"><Mail size={12} /></div>
                                    <a href={`mailto:${lead.email}`} className="hover:text-white transition-colors truncate">{lead.email}</a>
                                  </div>
                                  {lead.phone && (
                                    <div className="flex items-center gap-3 text-xs text-white/50">
                                      <div className="w-6 h-6 rounded-md bg-white/5 flex items-center justify-center border border-white/5"><Phone size={12} /></div>
                                      <a href={`tel:${lead.phone}`} className="hover:text-white transition-colors">{lead.phone}</a>
                                    </div>
                                  )}
                                </div>
                                
                                <div className="text-xs text-white/60 bg-black/50 p-3 rounded-xl border border-white/5 line-clamp-3 mb-4 italic leading-relaxed">
                                  "{lead.message}"
                                </div>
                                
                                <div className="flex justify-between items-center text-[9px] text-white/30 font-bold uppercase tracking-widest pt-3 border-t border-white/5">
                                  <div className="flex items-center gap-1.5"><Clock size={10} /> {new Date(lead.createdAt).toLocaleDateString()}</div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              ))}
            </div>
          </DragDropContext>
        </div>
      )}
    </div>
  );
}
