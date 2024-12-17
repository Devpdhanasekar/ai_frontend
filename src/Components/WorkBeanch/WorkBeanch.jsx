// import React, { useState, useCallback } from "react";
// import ReactFlow, {
//   ReactFlowProvider,
//   addEdge,
//   useNodesState,
//   useEdgesState,
//   Controls,
//   Background,
//   MiniMap,
//   Handle,
// } from "react-flow-renderer";
// import axios from "axios";

// const CustomNode = ({ id, data, onDelete }) => (
//   <div
//     style={{
//       position: "relative",
//       padding: "10px",
//       border: "1px solid #007bff",
//       borderRadius: "5px",
//       backgroundColor: "#fff",
//     }}
//   >
//     <div
//       style={{
//         position: "absolute",
//         top: "5px",
//         right: "5px",
//         cursor: "pointer",
//       }}
//       onClick={() => onDelete(id)}
//     >
//       ❌
//     </div>
//     {data.label}
//   </div>
// );

// const Sidebar = ({ onAddNode }) => (
//   <aside
//     style={{ padding: "20px", width: "250px", backgroundColor: "#f5f5f5" }}
//   >
//     <h3>Sidebar</h3>
//     <div
//       style={sidebarItemStyle}
//       draggable
//       onDragStart={(e) => onAddNode(e, "urlNode")}
//       onClick={() => onAddNode(null, "urlNode")}
//     >
//       URL to Scrape
//     </div>
//     <div
//       style={sidebarItemStyle}
//       draggable
//       onDragStart={(e) => onAddNode(e, "endpointsNode")}
//       onClick={() => onAddNode(null, "endpointsNode")}
//     >
//       Endpoints List
//     </div>
//     <div
//       style={sidebarItemStyle}
//       draggable
//       onDragStart={(e) => onAddNode(e, "actionNode")}
//       onClick={() => onAddNode(null, "actionNode")}
//     >
//       Action Button
//     </div>
//   </aside>
// );

// const sidebarItemStyle = {
//   padding: "10px",
//   marginBottom: "10px",
//   backgroundColor: "#007bff",
//   color: "#fff",
//   textAlign: "center",
//   cursor: "pointer",
//   borderRadius: "5px",
// };

// const WorkBeanch = () => {
//   const [nodes, setNodes, onNodesChange] = useNodesState([]);
//   const [edges, setEdges, onEdgesChange] = useEdgesState([]);
//   const [endpoints, setEndpoints] = useState([]);
//   const [buttonText, setButtonText] = useState("Editable Text");

//   const onConnect = useCallback(
//     (params) => setEdges((eds) => addEdge(params, eds)),
//     [setEdges]
//   );

//   const addNode = (type, position) => {
//     const id = `${type}-${nodes.length + 1}`;
//     const newNode = {
//       id,
//       type,
//       position,
//       data: {
//         label: (
//           <CustomNode
//             id={id}
//             data={{
//               label:
//                 type === "urlNode" ? (
//                   <input
//                     type="text"
//                     placeholder="Enter URL"
//                     onChange={(e) => handleUrlChange(e, id)}
//                     style={{ width: "100%", padding: "5px" }}
//                   />
//                 ) : type === "endpointsNode" ? (
//                   <div>{endpoints.join(", ") || "No endpoints yet"}</div>
//                 ) : (
//                   <input
//                     type="text"
//                     value={buttonText}
//                     onChange={(e) => setButtonText(e.target.value)}
//                     style={{ width: "100%", padding: "5px" }}
//                   />
//                 ),
//             }}
//             onDelete={handleDeleteNode}
//           />
//         ),
//       },
//     };
//     setNodes((nds) => nds.concat(newNode));
//   };

//   const handleUrlChange = (e, nodeId) => {
//     const urlValue = e.target.value;
//     setNodes((nds) =>
//       nds.map((node) =>
//         node.id === nodeId
//           ? { ...node, data: { ...node.data, url: urlValue } }
//           : node
//       )
//     );
//   };

//   const onAddNode = (event, type) => {
//     const position = event
//       ? { x: event.clientX, y: event.clientY }
//       : { x: Math.random() * 400, y: Math.random() * 400 };
//     addNode(type, position);
//   };

//   const handleDrop = (event) => {
//     event.preventDefault();
//     const type = event.dataTransfer.getData("application/reactflow");
//     const position = { x: event.clientX, y: event.clientY };
//     if (type) {
//       addNode(type, position);
//     }
//   };

//   const handleDragStart = (event, type) => {
//     event.dataTransfer.setData("application/reactflow", type);
//     event.dataTransfer.effectAllowed = "move";
//   };

//   const handleDragOver = (event) => {
//     event.preventDefault();
//     event.dataTransfer.dropEffect = "move";
//   };

//   const handleDeleteNode = useCallback(
//     (nodeId) => {
//       setNodes((nds) => nds.filter((node) => node.id !== nodeId));
//       setEdges((eds) =>
//         eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
//       );
//     },
//     [setNodes, setEdges]
//   );

//   const handleExecute = async () => {
//     const urlNode = nodes.find((node) => node.type === "urlNode");
//     console.log("one");
//     const actionNode = nodes.find((node) => node.type === "actionNode");
//     console.log("one");
//     const connectedToEndpoints = edges.some(
//       (edge) => edge.source === urlNode?.id && edge.target === "endpointsNode"
//     );
//     console.log("one");
//     const connectedToAction = edges.some(
//       (edge) =>
//         edge.source === "endpointsNode" && edge.target === actionNode?.id
//     );
//     console.log("one", connectedToEndpoints && urlNode?.data.url);

//     if (connectedToEndpoints && urlNode?.data.url) {
//       console.log("URL:", urlNode.data.url);
//       const response = await axios.post(
//         `http://3.108.54.190:8080/getendpoints`,
//         (data = { url: urlNode.data.url })
//       );
//       const data = await response.json();
//       setEndpoints(data);
//       setNodes((nds) =>
//         nds.map((node) =>
//           node.type === "endpointsNode"
//             ? {
//                 ...node,
//                 data: { ...node.data, label: data.join(", ") },
//               }
//             : node
//         )
//       );
//     }
//     if (connectedToAction) {
//       const response = await fetch(`https://api.example.com/action`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ endpoints, buttonText }),
//       });
//       const result = await response.json();
//       console.log("API Action Result:", result);
//     }
//   };

//   return (
//     <div style={{ display: "flex", height: "100vh" }}>
//       <Sidebar onAddNode={onAddNode} />
//       <div
//         style={{ flexGrow: 1, height: "100vh", background: "#fff" }}
//         onDrop={handleDrop}
//         onDragOver={handleDragOver}
//       >
//         <ReactFlowProvider>
//           <ReactFlow
//             nodes={nodes}
//             edges={edges}
//             onNodesChange={onNodesChange}
//             onEdgesChange={onEdgesChange}
//             onConnect={onConnect}
//             style={{ backgroundColor: "#f0f0f0" }}
//             fitView
//           >
//             <Controls />
//             <MiniMap />
//             <Background variant="dots" gap={12} size={1} />
//           </ReactFlow>
//           <button
//             onClick={handleExecute}
//             style={{ position: "absolute", bottom: 20, left: 20 }}
//           >
//             Execute
//           </button>
//         </ReactFlowProvider>
//       </div>
//     </div>
//   );
// };

// export default WorkBeanch;
// import React, { useState, useCallback } from "react";
// import ReactFlow, {
//   ReactFlowProvider,
//   addEdge,
//   useNodesState,
//   useEdgesState,
//   Controls,
//   Background,
//   MiniMap,
//   Handle,
// } from "react-flow-renderer";
// import axios from "axios";

// const CustomNode = ({ id, data, onDelete }) => (
//   <div
//     style={{
//       position: "relative",
//       padding: "10px",
//       border: "1px solid #007bff",
//       borderRadius: "5px",
//       backgroundColor: "#fff",
//     }}
//   >
//     <div
//       style={{
//         position: "absolute",
//         top: "5px",
//         right: "5px",
//         cursor: "pointer",
//       }}
//       onClick={() => onDelete(id)}
//     >
//       ❌
//     </div>
//     {data.label}
//   </div>
// );

// const Sidebar = ({ onAddNode }) => (
//   <aside
//     style={{ padding: "20px", width: "250px", backgroundColor: "#f5f5f5" }}
//   >
//     <h3>Sidebar</h3>
//     <div
//       style={sidebarItemStyle}
//       draggable
//       onDragStart={(e) => onAddNode(e, "urlNode")}
//       onClick={() => onAddNode(null, "urlNode")}
//     >
//       URL to Scrape
//     </div>
//     <div
//       style={sidebarItemStyle}
//       draggable
//       onDragStart={(e) => onAddNode(e, "endpointsNode")}
//       onClick={() => onAddNode(null, "endpointsNode")}
//     >
//       Endpoints List
//     </div>
//     <div
//       style={sidebarItemStyle}
//       draggable
//       onDragStart={(e) => onAddNode(e, "actionNode")}
//       onClick={() => onAddNode(null, "actionNode")}
//     >
//       Action Button
//     </div>
//   </aside>
// );

// const sidebarItemStyle = {
//   padding: "10px",
//   marginBottom: "10px",
//   backgroundColor: "#007bff",
//   color: "#fff",
//   textAlign: "center",
//   cursor: "pointer",
//   borderRadius: "5px",
// };

// const WorkBeanch = () => {
//   const [nodes, setNodes, onNodesChange] = useNodesState([]);
//   const [edges, setEdges, onEdgesChange] = useEdgesState([]);
//   const [endpoints, setEndpoints] = useState([]);
//   const [buttonText, setButtonText] = useState("Editable Text");

//   const onConnect = useCallback(
//     (params) => setEdges((eds) => addEdge(params, eds)),
//     [setEdges]
//   );

//   const addNode = (type, position) => {
//     const id = `${type}-${nodes.length + 1}`;
//     const newNode = {
//       id,
//       type,
//       position,
//       data: {
//         label: (
//           <CustomNode
//             id={id}
//             data={{
//               label:
//                 type === "urlNode" ? (
//                   <input
//                     type="text"
//                     placeholder="Enter URL"
//                     onChange={(e) => handleUrlChange(e, id)}
//                     style={{ width: "100%", padding: "5px" }}
//                   />
//                 ) : type === "endpointsNode" ? (
//                   <div>{endpoints.join(", ") || "No endpoints yet"}</div>
//                 ) : (
//                   <input
//                     type="text"
//                     value={buttonText}
//                     onChange={(e) => setButtonText(e.target.value)}
//                     style={{ width: "100%", padding: "5px" }}
//                   />
//                 ),
//             }}
//             onDelete={handleDeleteNode}
//           />
//         ),
//       },
//     };
//     setNodes((nds) => nds.concat(newNode));
//   };

//   const handleUrlChange = (e, nodeId) => {
//     const urlValue = e.target.value;
//     setNodes((nds) =>
//       nds.map((node) =>
//         node.id === nodeId
//           ? { ...node, data: { ...node.data, url: urlValue } }
//           : node
//       )
//     );
//   };

//   const onAddNode = (event, type) => {
//     const position = event
//       ? { x: event.clientX, y: event.clientY }
//       : { x: Math.random() * 400, y: Math.random() * 400 };
//     addNode(type, position);
//   };

//   const handleDrop = (event) => {
//     event.preventDefault();
//     const type = event.dataTransfer.getData("application/reactflow");
//     const position = { x: event.clientX, y: event.clientY };
//     if (type) {
//       addNode(type, position);
//     }
//   };

//   const handleDragStart = (event, type) => {
//     event.dataTransfer.setData("application/reactflow", type);
//     event.dataTransfer.effectAllowed = "move";
//   };

//   const handleDragOver = (event) => {
//     event.preventDefault();
//     event.dataTransfer.dropEffect = "move";
//   };

//   const handleDeleteNode = useCallback(
//     (nodeId) => {
//       setNodes((nds) => nds.filter((node) => node.id !== nodeId));
//       setEdges((eds) =>
//         eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
//       );
//     },
//     [setNodes, setEdges]
//   );

//   const handleExecute = async () => {
//     const urlNode = nodes.find((node) => node.type === "urlNode");
//     const endpointsNode = nodes.find((node) => node.type === "endpointsNode");
//     const actionNode = nodes.find((node) => node.type === "actionNode");

//     console.log("Current Nodes: ", nodes);
//     console.log("Current Edges: ", edges);

//     const connectedToEndpoints = edges.some((edge) => {
//       const isConnected =
//         edge.source === urlNode?.id && edge.target === endpointsNode?.id;
//       console.log(
//         `Checking edge from ${edge.source} to ${edge.target} - Connected:`,
//         isConnected
//       );
//       return isConnected;
//     });
//     const connectedToAction = edges.some(
//       (edge) =>
//         edge.source === endpointsNode?.id && edge.target === actionNode?.id
//     );
//     console.log("Connected to Endpoints: ", connectedToEndpoints);
//     console.log("Connected to Action: ", connectedToAction);
//     console.log("one", connectedToEndpoints && urlNode?.data.url);
//     console.log("URL present in URL Node?", urlNode?.data.url);

//     if (connectedToEndpoints && urlNode?.data.url) {
//       console.log("URL present in URL Node?");
//       try {
//         const response = await axios.post(
//           `http://3.108.54.190:8080/getendpoints`,
//           { url: urlNode.data.url }
//         );
//         console.log("response", response);
//         const data = await response.data;
//         setEndpoints(data);
//         setNodes((nds) =>
//           nds.map((node) =>
//             node.type === "endpointsNode"
//               ? {
//                   ...node,
//                   data: { ...node.data, label: data.join(", ") },
//                 }
//               : node
//           )
//         );
//       } catch (error) {
//         console.error("Failed to fetch endpoints:", error);
//       }
//     } else {
//       console.warn(
//         "Either no URL provided or no connection to Endpoints node."
//       );
//     }

//     if (connectedToAction && endpoints.length > 0) {
//       try {
//         const response = await fetch(`https://api.example.com/action`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ endpoints, buttonText }),
//         });
//         const result = await response.json();
//         console.log("API Action Result:", result);
//       } catch (error) {
//         console.error("Failed to execute action:", error);
//       }
//     } else {
//       console.warn(
//         "Endpoints are not connected to the Action node or no endpoints available."
//       );
//     }
//   };

//   return (
//     <div style={{ display: "flex", height: "100vh" }}>
//       <Sidebar onAddNode={onAddNode} />
//       <div
//         style={{ flexGrow: 1, height: "100vh", background: "#fff" }}
//         onDrop={handleDrop}
//         onDragOver={handleDragOver}
//       >
//         <ReactFlowProvider>
//           <ReactFlow
//             nodes={nodes}
//             edges={edges}
//             onNodesChange={onNodesChange}
//             onEdgesChange={onEdgesChange}
//             onConnect={onConnect}
//             style={{ backgroundColor: "#f0f0f0" }}
//             fitView
//           >
//             <Controls />
//             <MiniMap />
//             <Background variant="dots" gap={12} size={1} />
//           </ReactFlow>
//           <button
//             onClick={handleExecute}
//             style={{ position: "absolute", bottom: 20, left: 20 }}
//           >
//             Execute
//           </button>
//         </ReactFlowProvider>
//       </div>
//     </div>
//   );
// };

// export default WorkBeanch;
import React, { useState, useCallback } from "react";
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MiniMap,
  Handle,
} from "react-flow-renderer";
import axios from "axios";

const CustomNode = ({ id, data, onDelete }) => (
  <div
    style={{
      position: "relative",
      padding: "10px",
      border: "1px solid #007bff",
      borderRadius: "5px",
      backgroundColor: "#fff",
    }}
  >
    <div
      style={{
        position: "absolute",
        top: "5px",
        right: "5px",
        cursor: "pointer",
      }}
      onClick={() => onDelete(id)}
    >
      ❌
    </div>
    {data.label}
  </div>
);

const Sidebar = ({ onAddNode }) => (
  <aside
    style={{ padding: "20px", width: "250px", backgroundColor: "#f5f5f5" }}
  >
    <h3>Sidebar</h3>
    <div
      style={sidebarItemStyle}
      draggable
      onDragStart={(e) => onAddNode(e, "urlNode")}
      onClick={() => onAddNode(null, "urlNode")}
    >
      URL to Scrape
    </div>
    <div
      style={sidebarItemStyle}
      draggable
      onDragStart={(e) => onAddNode(e, "endpointsNode")}
      onClick={() => onAddNode(null, "endpointsNode")}
    >
      Endpoints List
    </div>
    <div
      style={sidebarItemStyle}
      draggable
      onDragStart={(e) => onAddNode(e, "actionNode")}
      onClick={() => onAddNode(null, "actionNode")}
    >
      Action Button
    </div>
    <div
      style={sidebarItemStyle}
      draggable
      onDragStart={(e) => onAddNode(e, "rawDataNode")}
      onClick={() => onAddNode(null, "rawDataNode")}
    >
      High priority urls
    </div>
  </aside>
);

const sidebarItemStyle = {
  padding: "10px",
  marginBottom: "10px",
  backgroundColor: "#007bff",
  color: "#fff",
  textAlign: "center",
  cursor: "pointer",
  borderRadius: "5px",
};

const RawDataContainer = ({ rawData, isLoading }) => {
  return (
    <div
      style={{
        padding: "10px",
        width: "800px",
        border: "1px solid #007bff",
        borderRadius: "5px",
        backgroundColor: "#fff",
        maxHeight: "500px", // Limit height for scrolling
        overflowY: "auto", // Scrollable if content overflows
        maxWidth: "800px",
      }}
    >
      {isLoading ? (
        <p>Loading High priority urls...</p>
      ) : rawData ? (
        <pre>{JSON.stringify(rawData, null, 2)}</pre> // Display raw data in a formatted way
      ) : (
        <p>No High priority urls available.</p>
      )}
    </div>
  );
};

const WorkBeanch = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [endpoints, setEndpoints] = useState([]);
  const [buttonText, setButtonText] = useState("Editable Text");
  const [rawData, setRawData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const addNode = (type, position) => {
    const id = `${type}-${nodes.length + 1}`;
    const newNode = {
      id,
      type,
      position,
      data: {
        label: (
          <CustomNode
            id={id}
            data={{
              label:
                type === "urlNode" ? (
                  <input
                    type="text"
                    placeholder="Enter URL"
                    onChange={(e) => handleUrlChange(e, id)}
                    style={{ width: "100%", padding: "5px" }}
                  />
                ) : type === "endpointsNode" ? (
                  <div>{endpoints.join(", ") || "No endpoints yet"}</div>
                ) : type === "rawDataNode" ? (
                  <RawDataContainer data={(rawData, isLoading)} />
                ) : (
                  <input
                    type="text"
                    value={buttonText}
                    onChange={(e) => setButtonText(e.target.value)}
                    style={{ width: "100%", padding: "5px" }}
                  />
                ),
            }}
            onDelete={handleDeleteNode}
          />
        ),
      },
    };
    setNodes((nds) => nds.concat(newNode));
  };

  const handleUrlChange = (e, nodeId) => {
    const urlValue = e.target.value;
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, url: urlValue } }
          : node
      )
    );
  };

  const onAddNode = (event, type) => {
    const position = event
      ? { x: event.clientX, y: event.clientY }
      : { x: Math.random() * 400, y: Math.random() * 400 };
    addNode(type, position);
  };

  const handleDeleteNode = useCallback(
    (nodeId) => {
      setNodes((nds) => nds.filter((node) => node.id !== nodeId));
      setEdges((eds) =>
        eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
      );
    },
    [setNodes, setEdges]
  );

  const handleExecute = async () => {
    const urlNode = nodes.find((node) => node.type === "urlNode");
    const endpointsNode = nodes.find((node) => node.type === "endpointsNode");
    const rawDataNode = nodes.find((node) => node.type === "rawDataNode");

    console.log("Current Nodes: ", nodes);
    console.log("Current Edges: ", edges);

    const connectedToEndpoints = edges.some((edge) => {
      const isConnected =
        edge.source === urlNode?.id && edge.target === endpointsNode?.id;
      console.log(
        `Checking edge from ${edge.source} to ${edge.target} - Connected:`,
        isConnected
      );
      return isConnected;
    });

    const connectedToRawData = edges.some(
      (edge) =>
        edge.source === endpointsNode?.id && edge.target === rawDataNode?.id
    );
    console.log("Connected to Endpoints: ", connectedToEndpoints);
    console.log("Connected to Raw Data: ", connectedToRawData);

    if (connectedToEndpoints && urlNode?.data.url && !connectedToRawData) {
      try {
        const response = await axios.post(
          `http://3.108.54.190:8080/getendpoints`,
          { url: urlNode.data.url }
        );
        console.log("response", response);
        const data = await response.data;
        setEndpoints(data);
        setNodes((nds) =>
          nds.map((node) =>
            node.type === "endpointsNode"
              ? {
                  ...node,
                  data: { ...node.data, label: data.join(", ") },
                }
              : node
          )
        );
      } catch (error) {
        console.error("Failed to fetch endpoints:", error);
      }
    } else {
      console.warn(
        "Either no URL provided or no connection to Endpoints node."
      );
    }

    if (connectedToRawData && endpoints.length > 0) {
      try {
        const response = await axios.post(
          "http://3.108.54.190:8080/getrawdata",
          {
            url: urlNode.data.url,
            endpoints: endpoints,
            isFlag: true,
          }
        );
        console.log("Raw data response:", response);
        setRawData(response.data); // Assuming response.data is large raw text or data
        setNodes((nds) =>
          nds.map((node) =>
            node.type === "rawDataNode"
              ? {
                  ...node,
                  data: { ...node.data, label: response.data },
                }
              : node
          )
        );
      } catch (error) {
        console.error("Failed to fetch raw data:", error);
      }
    } else {
      console.warn(
        "Endpoints are not connected to Raw Data node or no endpoints available."
      );
    }
  };
  // Handle drag over to allow the drop event
  const handleDragOver = (event) => {
    event.preventDefault();
  };

  // Handle drop to add a node at the drop location
  const handleDrop = (event) => {
    event.preventDefault();

    const position = {
      x: event.clientX,
      y: event.clientY,
    };

    // Add the new node to the flow (you can customize this as needed)
    const type = event.dataTransfer.getData("type"); // Assuming 'type' was set on the drag event
    addNode(type, position);
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar onAddNode={onAddNode} />
      <div
        style={{ flexGrow: 1, height: "100vh", background: "#fff" }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <ReactFlowProvider>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
          >
            <Controls />
            <Background />
            <MiniMap />
          </ReactFlow>
        </ReactFlowProvider>
        <button onClick={handleExecute}>Execute</button>
      </div>
    </div>
  );
};

export default WorkBeanch;
