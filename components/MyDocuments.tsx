
import React, { useState, useEffect, useRef } from 'react';
import { StoredDocument } from '../types';

interface MyDocumentsProps {
  onBack: () => void;
}

const STORAGE_KEY = 'unify_documents';

const MyDocuments: React.FC<MyDocumentsProps> = ({ onBack }) => {
  const [documents, setDocuments] = useState<StoredDocument[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDocName, setNewDocName] = useState('');
  const [newDocCategory, setNewDocCategory] = useState('Identificação');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = ["Identificação", "Habitação", "Saúde", "Trabalho", "Finanças", "Educação", "Outros"];

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setDocuments(JSON.parse(saved));
      } catch (e) {
        console.error("Error loading documents", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(documents));
  }, [documents]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (!newDocName) {
        setNewDocName(file.name.split('.')[0]);
      }
    }
  };

  const saveDocument = async () => {
    if (!selectedFile || !newDocName) return;
    setLoading(true);

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      const newDoc: StoredDocument = {
        id: crypto.randomUUID(),
        name: newDocName,
        category: newDocCategory,
        date: new Date().toLocaleDateString(),
        mimeType: selectedFile.type,
        data: base64
      };
      setDocuments([newDoc, ...documents]);
      resetForm();
    };
    reader.readAsDataURL(selectedFile);
  };

  const resetForm = () => {
    setNewDocName('');
    setNewDocCategory('Identificação');
    setSelectedFile(null);
    setShowAddForm(false);
    setLoading(false);
  };

  const deleteDocument = (id: string) => {
    if (confirm("Tem certeza que deseja apagar este documento?")) {
      setDocuments(documents.filter(d => d.id !== id));
    }
  };

  const downloadDocument = (doc: StoredDocument) => {
    const link = document.createElement('a');
    link.href = doc.data;
    link.download = `${doc.name}.${doc.mimeType.split('/')[1]}`;
    link.click();
  };

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm animate-fade-in min-h-[600px]">
      <div className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Voltar
        </button>
        <button 
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-100"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
          </svg>
          Novo Documento
        </button>
      </div>

      <div className="mb-10">
        <h2 className="text-3xl font-extrabold text-slate-900 mb-3">Meus Documentos</h2>
        <p className="text-slate-600 text-lg">Centralize e guarde cópias digitais dos seus papéis importantes com total segurança no seu dispositivo.</p>
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl animate-scale-in">
            <h3 className="text-2xl font-bold text-slate-800 mb-6">Carregar Documento</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Tipo de Ficheiro</label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${selectedFile ? 'bg-green-50 border-green-300' : 'bg-slate-50 border-slate-200 hover:border-blue-300'}`}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    className="hidden" 
                    accept="image/*,application/pdf" 
                  />
                  {selectedFile ? (
                    <div className="flex flex-col items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-bold text-slate-700 truncate w-full">{selectedFile.name}</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <div className="bg-white p-3 rounded-xl shadow-sm mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                      <span className="font-bold text-slate-600">PDF, Foto ou Imagem</span>
                      <span className="text-sm text-slate-400">Clique para selecionar ou tirar foto</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Nome do Documento</label>
                <input 
                  type="text" 
                  value={newDocName}
                  onChange={(e) => setNewDocName(e.target.value)}
                  placeholder="Ex: Passaporte, Contrato Arrendamento..."
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 focus:border-blue-400 outline-none font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Categoria</label>
                <select 
                  value={newDocCategory}
                  onChange={(e) => setNewDocCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 focus:border-blue-400 outline-none font-medium appearance-none bg-slate-50"
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  onClick={resetForm}
                  className="flex-1 px-6 py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-100 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={saveDocument}
                  disabled={!selectedFile || !newDocName || loading}
                  className="flex-1 px-6 py-4 rounded-2xl font-bold bg-blue-600 text-white hover:bg-blue-700 disabled:bg-slate-200 transition-all shadow-lg shadow-blue-100"
                >
                  {loading ? 'A guardar...' : 'Guardar Documento'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {documents.length === 0 ? (
        <div className="py-20 text-center flex flex-col items-center">
          <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Ainda não tem documentos guardados</h3>
          <p className="text-slate-500 max-w-sm">Comece a organizar a sua documentação clicando no botão "Novo Documento".</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {documents.map((doc) => (
            <div key={doc.id} className="bg-white border border-slate-100 rounded-[2rem] overflow-hidden hover:shadow-xl transition-all group border-2 border-transparent hover:border-blue-100">
              <div className="h-40 bg-slate-50 flex items-center justify-center p-4 relative">
                {doc.mimeType.startsWith('image/') ? (
                  <img src={doc.data} alt={doc.name} className="h-full object-contain rounded shadow-sm" />
                ) : (
                  <div className="flex flex-col items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <span className="text-xs font-bold text-red-500 uppercase mt-2">PDF Document</span>
                  </div>
                )}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold text-blue-600 uppercase tracking-widest border border-blue-50">
                  {doc.category}
                </div>
              </div>
              
              <div className="p-6">
                <h4 className="font-bold text-slate-800 text-lg truncate mb-1" title={doc.name}>{doc.name}</h4>
                <p className="text-slate-400 text-sm mb-6 flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Adicionado em {doc.date}
                </p>

                <div className="flex gap-2">
                  <button 
                    onClick={() => downloadDocument(doc)}
                    className="flex-1 bg-blue-50 text-blue-600 py-3 rounded-xl font-bold text-sm hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Baixar
                  </button>
                  <button 
                    onClick={() => deleteDocument(doc.id)}
                    className="w-12 h-12 flex items-center justify-center bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-12 bg-teal-50 rounded-3xl p-8 border border-teal-100 flex flex-col md:flex-row items-center gap-6">
        <div className="bg-white p-4 rounded-full shadow-sm text-4xl">🔒</div>
        <div>
          <h4 className="font-bold text-teal-900 text-lg mb-1">A sua privacidade é sagrada</h4>
          <p className="text-teal-700 leading-relaxed">
            Os seus documentos são guardados apenas no seu navegador. A Unify não armazena os seus ficheiros nos nossos servidores, garantindo que só você tem acesso a eles.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MyDocuments;
