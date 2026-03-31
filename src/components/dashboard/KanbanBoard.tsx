"use client";

import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { useCrmStore } from "@/store/crmStore";
import { Deal, DealStage } from "@/types";
import { DealModal } from "./DealModal";
import { Plus, GripVertical, Calendar, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

const STAGES: DealStage[] = ["Lead", "Contacted", "Proposal", "Negotiation", "Closed Won", "Closed Lost"];

const STAGE_LABELS: Record<DealStage, string> = {
  "Lead": "Lid (Yangi)",
  "Contacted": "Muloqotda",
  "Proposal": "Taklif Yuborilgan",
  "Negotiation": "Muzokara",
  "Closed Won": "Yutilgan",
  "Closed Lost": "Yutqazilgan"
};

export function KanbanBoard() {
  const { deals, fetchDeals, updateDeal, addDeal } = useCrmStore();
  const [boardDeals, setBoardDeals] = useState<Deal[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);

  useEffect(() => {
    fetchDeals();
  }, [fetchDeals]);

  useEffect(() => {
    setBoardDeals(deals);
  }, [deals]);

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    const newStage = destination.droppableId as DealStage;
    
    // Optimistic UI update
    const newBoardDeals = Array.from(boardDeals);
    const draggedDealIndex = newBoardDeals.findIndex(d => d.id === draggableId);
    if (draggedDealIndex > -1) {
      const deal = newBoardDeals[draggedDealIndex];
      deal.stage = newStage;
      setBoardDeals(newBoardDeals);
    }
    
    // Sync to Firestore
    await updateDeal(draggableId, { stage: newStage });
  };

  const handleOpenModal = (deal?: Deal) => {
    setEditingDeal(deal || null);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Sotuv Voronkasi (Pipeline)</h1>
          <p className="text-sm text-gray-500 mt-1">Shartnomalarni bosqichma-bosqich o'tkazish uchun ularni suring.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()} 
          className="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" /> Shartnoma Qo'shish
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6 md:overflow-x-auto pb-6 -mx-4 px-4 md:mx-0 md:px-0 h-auto md:h-[calc(100vh-250px)]">
        <DragDropContext onDragEnd={onDragEnd}>
          {STAGES.map(stage => {
            const stageDeals = boardDeals.filter(d => d.stage === stage);
            
            return (
              <div key={stage} className="flex-shrink-0 w-full md:w-80 flex flex-col bg-gray-100/50 rounded-2xl mb-4 md:mb-0">
                <div className="p-4 border-b border-gray-200/50 flex justify-between items-center sticky top-0 bg-gray-100/50 backdrop-blur-sm z-10 rounded-t-2xl">
                  <h3 className="font-bold text-gray-700 text-sm uppercase tracking-wider">{STAGE_LABELS[stage]}</h3>
                  <span className="text-xs font-bold bg-white text-indigo-600 px-2.5 py-1 rounded-lg shadow-sm ring-1 ring-gray-200/50">
                    {stageDeals.length}
                  </span>
                </div>
                
                <Droppable droppableId={stage}>
                  {(provided, snapshot) => (
                    <div 
                      ref={provided.innerRef} 
                      {...provided.droppableProps}
                      className={cn(
                        "flex-1 p-3 space-y-3 md:overflow-y-auto min-h-[100px] transition-colors rounded-b-2xl",
                        snapshot.isDraggingOver ? "bg-indigo-50/50" : ""
                      )}
                    >
                      {stageDeals.length === 0 ? (
                        <div className="py-8 text-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                           <p className="text-[10px] uppercase font-bold text-gray-400">Hozircha yo'q</p>
                        </div>
                      ) : (
                        stageDeals.map((deal, index) => (
                          <Draggable key={deal.id} draggableId={deal.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className={cn(
                                  "bg-white p-4 rounded-xl shadow-sm border border-gray-200 group transition-all hover:border-indigo-300 hover:shadow-md active:scale-95",
                                  snapshot.isDragging ? "shadow-2xl ring-2 ring-indigo-500 rotate-2 opacity-90 z-50" : ""
                                )}
                                onClick={() => handleOpenModal(deal)}
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <h4 className="font-bold text-gray-900 text-sm leading-tight">{deal.title}</h4>
                                  <div {...provided.dragHandleProps} className="text-gray-400 cursor-grab hover:text-gray-600 active:cursor-grabbing p-1 -m-1">
                                    <GripVertical className="h-4 w-4" />
                                  </div>
                                </div>
                                
                                {deal.customerName && (
                                  <p className="text-[11px] font-medium text-gray-500 mb-4">{deal.customerName}</p>
                                )}
                                
                                <div className="flex justify-between items-center text-[11px] mt-2 pt-3 border-t border-gray-50">
                                  <span className="flex items-center text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded-lg">
                                    <DollarSign className="w-3 h-3 mr-0.5" />
                                    {deal.value.toLocaleString()}
                                  </span>
                                  <span className="flex items-center text-gray-400 font-bold">
                                    <Calendar className="w-3 h-3 mr-1" />
                                    {new Date(deal.dueDate).toLocaleDateString("uz-UZ", { month: 'short', day: 'numeric' })}
                                  </span>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </DragDropContext>
      </div>

      <DealModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        deal={editingDeal}
        onSave={async (data) => {
          if (editingDeal) {
            await updateDeal(editingDeal.id, data);
            fetchDeals();
          } else {
            await addDeal(data);
            fetchDeals();
          }
        }}
      />
    </>
  );
}

