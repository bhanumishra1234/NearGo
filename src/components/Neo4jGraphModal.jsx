// src/components/Neo4jGraphModal.jsx
// Interactive Neo4j Knowledge Graph Visualizer & Cypher Query Playground for Evaluators

import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Share2,
  Database,
  Terminal,
  Compass,
  Sparkles,
  MapPin,
  ShieldAlert,
  ShieldCheck,
  Play,
  RotateCw,
  Loader2,
  ChevronRight,
  Info
} from 'lucide-react';

const LABEL_COLORS = {
  MetroStation: { bg: '#3B82F6', ring: '#93C5FD', text: 'text-blue-500', name: 'Metro Station' },
  SecretSpot: { bg: '#10B981', ring: '#A7F3D0', text: 'text-emerald-500', name: 'Secret Spot' },
  LocalGuide: { bg: '#F59E0B', ring: '#FDE68A', text: 'text-amber-500', name: 'Verified Local' },
  City: { bg: '#8B5CF6', ring: '#DDD6FE', text: 'text-purple-500', name: 'Urban Hub' },
  ScamWarningZone: { bg: '#EF4444', ring: '#FECACA', text: 'text-red-500', name: 'Scam Risk Zone' },
};

export default function Neo4jGraphModal({ isOpen, onClose, defaultCity = 'Delhi NCR' }) {
  const [selectedCity, setSelectedCity] = useState(defaultCity);
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [overview, setOverview] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('visualizer'); // 'visualizer' | 'cypher' | 'transit'

  // Cypher Playground State
  const [cypherQuery, setCypherQuery] = useState(
    'MATCH (s:SecretSpot)-[:LAST_MILE_ACCESS]->(m:MetroStation) RETURN s, m LIMIT 15'
  );
  const [cypherResults, setCypherResults] = useState(null);
  const [cypherRunning, setCypherRunning] = useState(false);

  // Shortest Path state & custom calculator
  const [transitPath, setTransitPath] = useState(null);
  const [customOrigin, setCustomOrigin] = useState('Kashmere Gate');
  const [customDest, setCustomDest] = useState('Majnu Ka Tilla');
  const [transitLoading, setTransitLoading] = useState(false);
  const [viewMode, setViewMode] = useState('canvas'); // 'canvas' | 'cards'

  const canvasRef = useRef(null);

  // Set city defaults
  useEffect(() => {
    if (selectedCity === 'Mumbai') {
      setCustomOrigin('Andheri Station');
      setCustomDest('Prithvi Theatre Juhu');
    } else if (selectedCity === 'Bengaluru') {
      setCustomOrigin('Majestic Station');
      setCustomDest('VV Puram Food Street');
    } else {
      setCustomOrigin('Kashmere Gate');
      setCustomDest('Majnu Ka Tilla');
    }
  }, [selectedCity]);

  // Fetch Graph Data and Overview
  useEffect(() => {
    if (!isOpen) return;
    let isMounted = true;
    setLoading(true);

    const orig = selectedCity === 'Mumbai' ? 'Andheri' : selectedCity === 'Bengaluru' ? 'Majestic' : 'Kashmere Gate';
    const dest = selectedCity === 'Mumbai' ? 'Prithvi Theatre Juhu' : selectedCity === 'Bengaluru' ? 'VV Puram Food Street' : 'Majnu Ka Tilla';

    Promise.all([
      fetch(`/api/graph/overview`).then((r) => r.json()).catch(() => ({})),
      fetch(`/api/graph/explore?city=${encodeURIComponent(selectedCity)}`).then((r) => r.json()).catch(() => ({})),
      fetch(`/api/graph/shortest-transit?city=${encodeURIComponent(selectedCity)}&origin=${encodeURIComponent(orig)}&destination=${encodeURIComponent(dest)}`).then((r) => r.json()).catch(() => ({})),
    ]).then(([ov, gd, tp]) => {
      if (!isMounted) return;
      if (ov.success) setOverview(ov);
      if (gd.success) {
        setGraphData(gd);
        if (gd.nodes.length > 0) setSelectedNode(gd.nodes[0]);
      }
      if (tp.success) setTransitPath(tp.route);
      setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [isOpen, selectedCity]);

  // Custom route calculation
  const handleCalculateTransit = async (origToUse, destToUse) => {
    const o = origToUse || customOrigin;
    const d = destToUse || customDest;
    setTransitLoading(true);
    try {
      const res = await fetch(`/api/graph/shortest-transit?city=${encodeURIComponent(selectedCity)}&origin=${encodeURIComponent(o)}&destination=${encodeURIComponent(d)}`);
      const data = await res.json();
      if (data.success && data.route) {
        setTransitPath(data.route);
      }
    } catch (e) {
      console.warn('[Transit Calculation Exception]:', e);
    } finally {
      setTransitLoading(false);
    }
  };

  // Run custom Cypher Query
  const handleExecuteCypher = async (queryToRun) => {
    const q = queryToRun || cypherQuery;
    setCypherRunning(true);
    try {
      const res = await fetch('/api/graph/cypher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cypher: q }),
      });
      const data = await res.json();
      setCypherResults(data);
    } catch (err) {
      setCypherResults({ success: false, error: err.message });
    } finally {
      setCypherRunning(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-fadeIn">
      <div className="bg-white dark:bg-[#0c0c0c] border border-stone-300 dark:border-[#222222] rounded-3xl w-full max-w-5xl h-[88vh] flex flex-col shadow-2xl overflow-hidden relative">
        {/* Top Header */}
        <div className="px-6 py-3.5 border-b border-stone-200 dark:border-[#1e1e1e] flex items-center justify-between bg-stone-50/70 dark:bg-[#121212]/70 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#008CC1] text-white flex items-center justify-center shadow-md font-bold">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-black text-stone-900 dark:text-white flex items-center gap-2">
                  <span>NearGo Knowledge Graph</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#008CC1]/10 text-[#008CC1] font-bold border border-[#008CC1]/30">
                    Neo4j Cypher Engine
                  </span>
                </h2>
              </div>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                Multi-Hop Transit Routing, Local Trust Graphs & Urban Knowledge Network
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* City Selector */}
            <select aria-label="Select City Network"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-stone-100 dark:bg-[#1c1c1c] text-stone-800 dark:text-stone-200 border border-stone-300 dark:border-[#333333] px-2.5 py-1 rounded-full text-xs font-semibold outline-none cursor-pointer"
            >
              <option value="Delhi NCR">Delhi NCR Network</option>
              <option value="Mumbai">Mumbai Network</option>
              <option value="Bengaluru">Bengaluru Network</option>
            </select>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200 dark:hover:bg-[#202020] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* View Tabs */}
        <div className="px-6 py-2 border-b border-stone-200 dark:border-[#1e1e1e] flex items-center gap-2 bg-white dark:bg-[#0c0c0c] shrink-0 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('visualizer')}
            className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all ${
              activeTab === 'visualizer'
                ? 'bg-[#008CC1] text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-[#1a1a1a]'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Graph Visualizer</span>
          </button>

          <button
            onClick={() => setActiveTab('cypher')}
            className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all ${
              activeTab === 'cypher'
                ? 'bg-[#008CC1] text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-[#1a1a1a]'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Cypher Playground</span>
          </button>

          <button
            onClick={() => setActiveTab('transit')}
            className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all ${
              activeTab === 'transit'
                ? 'bg-[#008CC1] text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-[#1a1a1a]'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Shortest-Path Transit</span>
          </button>

          {overview && (
            <div className="ml-auto flex items-center gap-3 text-[11px] text-stone-500 dark:text-stone-400 font-mono">
              <span>Nodes: <strong className="text-stone-800 dark:text-stone-200">{overview.totalNodes || graphData.nodes.length}</strong></span>
              <span>Edges: <strong className="text-stone-800 dark:text-stone-200">{overview.totalRelationships || graphData.links.length}</strong></span>
            </div>
          )}
        </div>

        {/* Tab 1: Graph Visualizer */}
        {activeTab === 'visualizer' && (
          <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
            {/* Visual Graph View Area */}
            <div className="md:col-span-8 bg-[#FAF8F5] dark:bg-[#070707] relative p-4 flex flex-col justify-between overflow-hidden">
              {/* Legend Badges & View Switcher */}
              <div className="flex items-center justify-between flex-wrap gap-2 z-10 pb-1">
                <div className="flex flex-wrap items-center gap-2">
                  {Object.entries(LABEL_COLORS).map(([key, meta]) => (
                    <div
                      key={key}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 dark:bg-[#141414]/90 border border-stone-200 dark:border-[#222222] shadow-2xs text-[10px] font-semibold text-stone-700 dark:text-stone-300"
                    >
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: meta.bg }}></span>
                      <span>{meta.name}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-1 bg-white/90 dark:bg-[#161616]/90 p-1 rounded-xl border border-stone-200 dark:border-[#222] text-[10px] font-bold">
                  <button
                    type="button"
                    onClick={() => setViewMode('canvas')}
                    className={`px-2 py-0.5 rounded-lg transition-all ${
                      viewMode === 'canvas' ? 'bg-[#008CC1] text-white' : 'text-stone-600 dark:text-stone-300 hover:text-stone-900'
                    }`}
                  >
                    Interactive Topology
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('cards')}
                    className={`px-2 py-0.5 rounded-lg transition-all ${
                      viewMode === 'cards' ? 'bg-[#008CC1] text-white' : 'text-stone-600 dark:text-stone-300 hover:text-stone-900'
                    }`}
                  >
                    Card Cloud
                  </button>
                </div>
              </div>

              {/* Visual Graph Area (Interactive Canvas Topology or Card Cloud) */}
              {viewMode === 'canvas' ? (
                <div className="flex-1 my-2 relative rounded-2xl bg-white/90 dark:bg-[#0c0c0c]/90 border border-stone-200/90 dark:border-[#1e1e1e] overflow-hidden flex flex-col items-center justify-center">
                  <svg className="w-full h-full min-h-[300px]">
                    <defs>
                      <linearGradient id="edgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#008CC1" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#10B981" stopOpacity="0.4" />
                      </linearGradient>
                    </defs>
                    {/* Render Relationship Edges */}
                    {graphData.links.map((link, idx) => {
                      const total = graphData.nodes.length || 1;
                      const sIdx = graphData.nodes.findIndex((n) => n.id === link.source);
                      const tIdx = graphData.nodes.findIndex((n) => n.id === link.target);
                      if (sIdx === -1 || tIdx === -1) return null;
                      const sAngle = (sIdx / total) * 2 * Math.PI;
                      const tAngle = (tIdx / total) * 2 * Math.PI;
                      const cx = 250;
                      const cy = 160;
                      const rx = 180;
                      const ry = 110;
                      const x1 = cx + rx * Math.cos(sAngle);
                      const y1 = cy + ry * Math.sin(sAngle);
                      const x2 = cx + rx * Math.cos(tAngle);
                      const y2 = cy + ry * Math.sin(tAngle);
                      return (
                        <g key={link.id || idx}>
                          <line
                            x1={x1}
                            y1={y1}
                            x2={x2}
                            y2={y2}
                            stroke="url(#edgeGrad)"
                            strokeWidth={selectedNode && (selectedNode.id === link.source || selectedNode.id === link.target) ? '2.5' : '1.2'}
                            strokeDasharray={link.type === 'LAST_MILE_ACCESS' ? '4 3' : 'none'}
                          />
                        </g>
                      );
                    })}

                    {/* Render Circular Nodes in Circular Force Layout */}
                    {graphData.nodes.map((node, idx) => {
                      const total = graphData.nodes.length || 1;
                      const angle = (idx / total) * 2 * Math.PI;
                      const cx = 250;
                      const cy = 160;
                      const rx = 180;
                      const ry = 110;
                      const x = cx + rx * Math.cos(angle);
                      const y = cy + ry * Math.sin(angle);
                      const meta = LABEL_COLORS[node.label] || { bg: '#6B7280', name: node.label };
                      const isSelected = selectedNode?.id === node.id;
                      return (
                        <g
                          key={node.id}
                          className="cursor-pointer transition-transform"
                          onClick={() => setSelectedNode(node)}
                        >
                          {isSelected && (
                            <circle cx={x} cy={y} r={16} fill="none" stroke="#008CC1" strokeWidth="3" className="animate-pulse" />
                          )}
                          <circle cx={x} cy={y} r={isSelected ? 11 : 8} fill={meta.bg} stroke="#ffffff" strokeWidth="2" />
                          <text
                            x={x}
                            y={y + 18}
                            textAnchor="middle"
                            fontSize="9"
                            fontWeight="bold"
                            className="fill-stone-800 dark:fill-stone-200 select-none pointer-events-none"
                          >
                            {node.name.length > 14 ? node.name.slice(0, 12) + '…' : node.name}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                  <div className="absolute bottom-2 left-3 text-[10px] text-stone-400 font-mono">
                    💡 Click any circle or edge to inspect graph properties & Cypher hops
                  </div>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto no-scrollbar py-4 grid grid-cols-2 sm:grid-cols-3 gap-3 content-start">
                {graphData.nodes.map((node) => {
                  const meta = LABEL_COLORS[node.label] || { bg: '#6B7280', name: node.label };
                  const isSelected = selectedNode?.id === node.id;
                  return (
                    <div
                      key={node.id}
                      onClick={() => setSelectedNode(node)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer select-none ${
                        isSelected
                          ? 'bg-white dark:bg-[#181818] border-[#008CC1] shadow-lg ring-2 ring-[#008CC1]/30 scale-[1.02]'
                          : 'bg-white/80 dark:bg-[#121212] border-stone-200/80 dark:border-[#1e1e1e] hover:border-stone-400 hover:shadow-xs'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: meta.bg }}></span>
                        <span className="text-[9px] font-mono font-bold text-stone-400 uppercase tracking-wider">
                          {node.label}
                        </span>
                      </div>
                      <div className="text-xs font-bold text-stone-900 dark:text-white truncate">
                        {node.name}
                      </div>
                      {node.properties.neighborhood && (
                        <div className="text-[10px] text-stone-500 dark:text-stone-400 truncate mt-0.5">
                          📍 {node.properties.neighborhood}
                        </div>
                      )}
                      {node.properties.line && (
                        <div className="text-[10px] text-blue-600 dark:text-blue-400 font-medium truncate mt-0.5">
                          🚇 {node.properties.line}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              )}

              {/* Bottom Quick Cypher Hint */}
              <div className="z-10 p-2.5 rounded-xl bg-white/90 dark:bg-[#141414]/90 border border-stone-200 dark:border-[#222222] text-[11px] font-mono text-stone-600 dark:text-stone-300 flex items-center justify-between">
                <span>⚡ Live Traversal: Connected via Neo4j Graph Model</span>
                <button
                  onClick={() => setActiveTab('cypher')}
                  className="text-[#008CC1] font-bold hover:underline flex items-center gap-1"
                >
                  <span>Query in Cypher</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Node Inspector Side Panel */}
            <div className="md:col-span-4 border-l border-stone-200 dark:border-[#1e1e1e] p-5 bg-white dark:bg-[#0c0c0c] overflow-y-auto">
              {selectedNode ? (
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold text-white"
                        style={{ backgroundColor: (LABEL_COLORS[selectedNode.label] || {}).bg || '#008CC1' }}
                      >
                        {selectedNode.label}
                      </span>
                      <span className="text-[10px] text-stone-400 font-mono">{selectedNode.id}</span>
                    </div>
                    <h3 className="text-lg font-black text-stone-900 dark:text-white leading-tight">
                      {selectedNode.name}
                    </h3>
                  </div>

                  {/* Node Properties Key-Value Table */}
                  <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-[#141414] border border-stone-200 dark:border-[#202020] space-y-2 text-xs">
                    <div className="text-[10px] font-extrabold text-stone-400 uppercase tracking-wider mb-1">
                      Graph Properties
                    </div>
                    {Object.entries(selectedNode.properties).map(([k, v]) => (
                      <div key={k} className="flex items-start justify-between gap-2 py-0.5 border-b border-stone-200/50 dark:border-[#1f1f1f] last:border-none">
                        <span className="font-mono text-stone-500 text-[11px]">{k}:</span>
                        <span className="font-semibold text-stone-800 dark:text-stone-200 text-right text-[11px] truncate max-w-[180px]">
                          {String(v)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Connected Relationships */}
                  <div>
                    <div className="text-[11px] font-extrabold text-stone-400 uppercase tracking-wider mb-2">
                      Connected Edges & Hops
                    </div>
                    <div className="space-y-2">
                      {graphData.links
                        .filter((l) => l.source === selectedNode.id || l.target === selectedNode.id)
                        .map((l) => {
                          const isOutgoing = l.source === selectedNode.id;
                          const otherNodeId = isOutgoing ? l.target : l.source;
                          const otherNode = graphData.nodes.find((n) => n.id === otherNodeId);
                          return (
                            <div
                              key={l.id}
                              onClick={() => otherNode && setSelectedNode(otherNode)}
                              className="p-2.5 rounded-xl border border-stone-200 dark:border-[#222222] hover:bg-stone-50 dark:hover:bg-[#181818] cursor-pointer transition-colors text-xs"
                            >
                              <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#008CC1] font-bold">
                                <span>{isOutgoing ? '➔ OUTGOING' : '⬅ INCOMING'}</span>
                                <span>[{l.type}]</span>
                              </div>
                              <div className="font-bold text-stone-900 dark:text-white mt-1">
                                {otherNode?.name || otherNodeId}
                              </div>
                              {l.properties.tip && (
                                <div className="text-[10px] text-stone-500 dark:text-stone-400 mt-1 italic">
                                  "{l.properties.tip}"
                                </div>
                              )}
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-center text-stone-400 text-xs">
                  Click any node on the left to inspect its graph properties and Cypher traversal paths.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Cypher Playground */}
        {activeTab === 'cypher' && (
          <div className="flex-1 p-6 flex flex-col space-y-4 overflow-y-auto">
            {/* Quick Cypher Templates */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-stone-500">Quick Cypher Templates:</span>
              <button
                onClick={() => {
                  const q = 'MATCH (s:SecretSpot)-[:LAST_MILE_ACCESS]->(m:MetroStation) RETURN s, m LIMIT 10';
                  setCypherQuery(q);
                  handleExecuteCypher(q);
                }}
                className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-[#1c1c1c] hover:bg-stone-200 dark:hover:bg-[#252525] text-stone-700 dark:text-stone-300 text-[11px] font-mono font-semibold"
              >
                1. Secret Spots ➔ Nearest Metro
              </button>
              <button
                onClick={() => {
                  const q = 'MATCH (u:LocalGuide)-[:ENDORSED_BY_LOCAL]->(s:SecretSpot) RETURN u, s LIMIT 10';
                  setCypherQuery(q);
                  handleExecuteCypher(q);
                }}
                className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-[#1c1c1c] hover:bg-stone-200 dark:hover:bg-[#252525] text-stone-700 dark:text-stone-300 text-[11px] font-mono font-semibold"
              >
                2. Local Guide Trust Network
              </button>
              <button
                onClick={() => {
                  const q = 'MATCH (m:MetroStation)-[:FLAGGED_RISK_ZONE]->(scam:ScamWarningZone) RETURN m, scam';
                  setCypherQuery(q);
                  handleExecuteCypher(q);
                }}
                className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-[#1c1c1c] hover:bg-stone-200 dark:hover:bg-[#252525] text-stone-700 dark:text-stone-300 text-[11px] font-mono font-semibold"
              >
                3. Scam Zone Early Warning
              </button>
            </div>

            {/* Query Editor Box */}
            <div className="rounded-2xl border border-stone-300 dark:border-[#222222] bg-stone-900 text-stone-100 p-4 font-mono text-xs shadow-inner">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-800 text-stone-400 text-[11px]">
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Neo4j Cypher Shell</span>
                </div>
                <span>Read-Only Mode</span>
              </div>
              <textarea
                value={cypherQuery}
                onChange={(e) => setCypherQuery(e.target.value)}
                rows={3}
                className="w-full bg-transparent text-emerald-300 outline-none resize-none font-mono text-xs"
              />
              <div className="flex justify-end pt-2">
                <button
                  onClick={() => handleExecuteCypher(cypherQuery)}
                  disabled={cypherRunning}
                  className="px-4 py-1.5 rounded-lg bg-[#008CC1] hover:bg-[#007ba8] text-white font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer disabled:opacity-50"
                >
                  {cypherRunning ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                  <span>Execute Cypher</span>
                </button>
              </div>
            </div>

            {/* Query Results */}
            <div className="flex-1 rounded-2xl border border-stone-200 dark:border-[#1e1e1e] bg-white dark:bg-[#101010] p-4 overflow-y-auto">
              <div className="text-xs font-bold text-stone-800 dark:text-stone-200 mb-2">
                Cypher Results {cypherResults?.count !== undefined && `(${cypherResults.count} records)`}
              </div>
              {cypherResults ? (
                cypherResults.success ? (
                  <pre className="text-[11px] font-mono text-stone-700 dark:text-stone-300 overflow-x-auto whitespace-pre-wrap">
                    {JSON.stringify(cypherResults.records, null, 2)}
                  </pre>
                ) : (
                  <div className="text-xs text-red-500 font-mono">Error: {cypherResults.error}</div>
                )
              ) : (
                <div className="text-stone-400 text-xs">Click "Execute Cypher" above to evaluate graph query execution.</div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Shortest Path Multi-Hop Transit */}
        {activeTab === 'transit' && (
          <div className="flex-1 p-6 space-y-5 overflow-y-auto">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-[#0d1624] dark:to-[#0f121d] border border-blue-200 dark:border-[#1e293b]">
              <div className="text-xs font-bold text-blue-900 dark:text-blue-300 mb-1 flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Multi-Hop Graph Pathfinding (Dijkstra Shortest Path)</span>
              </div>
              <p className="text-[11px] text-blue-800/80 dark:text-blue-300/80 leading-relaxed">
                NearGo traverses the Indian urban graph across Metro corridors, verified E-rickshaw stands, and footpaths while strictly computing legal meter tariffs and routing around reported auto tout zones.
              </p>
            </div>

            {/* Interactive Origin/Destination Query Bar */}
            <div className="p-4 rounded-2xl bg-white dark:bg-[#111] border border-stone-200 dark:border-[#222] shadow-xs space-y-3">
              <div className="text-xs font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5 text-[#008CC1]" />
                <span>Calculate Any Multi-Hop Graph Transit Route ({selectedCity}):</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center">
                <div className="sm:col-span-5">
                  <input
                    type="text"
                    value={customOrigin}
                    onChange={(e) => setCustomOrigin(e.target.value)}
                    placeholder="Origin (e.g. Connaught Place)"
                    className="w-full px-3 py-1.5 rounded-xl bg-stone-50 dark:bg-[#1a1a1a] border border-stone-200 dark:border-[#2c2c2c] text-xs font-semibold outline-none focus:border-[#008CC1]"
                  />
                </div>
                <div className="sm:col-span-5">
                  <input
                    type="text"
                    value={customDest}
                    onChange={(e) => setCustomDest(e.target.value)}
                    placeholder="Destination (e.g. Majnu Ka Tilla)"
                    className="w-full px-3 py-1.5 rounded-xl bg-stone-50 dark:bg-[#1a1a1a] border border-stone-200 dark:border-[#2c2c2c] text-xs font-semibold outline-none focus:border-[#008CC1]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <button
                    type="button"
                    onClick={() => handleCalculateTransit(customOrigin, customDest)}
                    disabled={transitLoading}
                    className="w-full py-1.5 px-3 rounded-xl bg-[#008CC1] hover:bg-[#007ba8] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    {transitLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3 h-3 fill-current" />}
                    <span>Traverse</span>
                  </button>
                </div>
              </div>
            </div>

            {transitPath && (
              <div className="space-y-4">
                <div className="p-3.5 rounded-xl bg-stone-900 text-white font-mono text-xs">
                  <span className="text-stone-400">Graph Algorithm:</span> <span>{transitPath.query}</span>
                </div>

                {/* Multi-Modal Metrics Grid */}
                {transitPath.multiModalSummary && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/40">
                      <div className="text-[10px] text-blue-700 dark:text-blue-300 font-bold uppercase">Total Time</div>
                      <div className="text-base font-extrabold text-blue-900 dark:text-white mt-0.5">
                        {transitPath.multiModalSummary.totalTimeMinutes} mins
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40">
                      <div className="text-[10px] text-emerald-700 dark:text-emerald-300 font-bold uppercase">Transit Fare</div>
                      <div className="text-base font-extrabold text-emerald-900 dark:text-white mt-0.5">
                        {transitPath.multiModalSummary.totalEstimatedFare}
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40">
                      <div className="text-[10px] text-amber-700 dark:text-amber-300 font-bold uppercase">Traffic Avoided</div>
                      <div className="text-base font-extrabold text-amber-900 dark:text-white mt-0.5">
                        {transitPath.multiModalSummary.trafficDelayAvoidedMinutes} mins
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/40">
                      <div className="text-[10px] text-purple-700 dark:text-purple-300 font-bold uppercase">CO2 Saved</div>
                      <div className="text-base font-extrabold text-purple-900 dark:text-white mt-0.5">
                        {transitPath.multiModalSummary.carbonKgSaved} kg
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-2.5">
                  <div className="text-xs font-extrabold uppercase text-stone-400 tracking-wider">
                    Multi-Modal Intermodal Route Legs:
                  </div>
                  {transitPath.optimalRoute.map((step) => (
                    <div
                      key={step.step}
                      className="p-3.5 rounded-2xl bg-stone-50 dark:bg-[#141414] border border-stone-200 dark:border-[#1f1f1f] flex items-center gap-3 text-xs"
                    >
                      <div className="w-7 h-7 rounded-full bg-[#008CC1] text-white font-black flex items-center justify-center shrink-0">
                        {step.step}
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-stone-900 dark:text-white">{step.type}</div>
                        <div className="text-[11px] text-stone-600 dark:text-stone-400 mt-0.5">{step.instruction}</div>
                        {step.tip && (
                          <div className="text-[10px] text-[#D9532F] font-medium mt-1">
                            💡 {step.tip}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center justify-between">
                  <span>Official Multi-Modal Tariff:</span>
                  <span>{transitPath.estimatedOfficialFare}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
