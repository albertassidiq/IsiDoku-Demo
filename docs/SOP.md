# SOP: Interactive Flow Chart dengan 4 Connection Points (Hover-Visible)

## Deskripsi
Implementasi flow chart dengan shapes yang memiliki 4 connection points (handles) di setiap sisi (atas, bawah, kiri, kanan). Connection points ini hanya muncul saat di-hover dan digunakan untuk menyambung shapes dengan arrows.

## Prasyarat
- React dengan TypeScript
- XYFlow (@xyflow/react) terinstall
- Tailwind CSS (opsional, untuk styling)

## Langkah-langkah Implementasi

### 1. Install Dependencies

```bash
pnpm add @xyflow/react
```

### 2. Buat Custom Shape Node dengan 4 Connection Points

Buat file `apps/web/components/ShapeNode.tsx`:

```tsx
import { memo, useState } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';

type ShapeNodeData = {
  label: string;
};

function ShapeNode({ data, selected }: NodeProps<ShapeNodeData>) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        padding: '16px 20px',
        borderRadius: '12px',
        border: `2px solid ${selected ? '#3b82f6' : '#1f2937'}`,
        background: 'white',
        minWidth: '140px',
        minHeight: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: isHovered ? '0 8px 16px rgba(0,0,0,0.2)' : '0 2px 8px rgba(0,0,0,0.1)',
        transition: 'all 0.2s ease',
        cursor: 'pointer',
      }}
    >
      {/* 4 Connection Points (Handles) - Hanya muncul saat hover */}
      {/* Atas - Bisa jadi source atau target */}
      <Handle
        type="source"
        position={Position.Top}
        style={{
          background: '#000',
          width: isHovered ? '12px' : '0px',
          height: isHovered ? '12px' : '0px',
          borderRadius: '50%',
          border: '2px solid white',
          boxShadow: '0 0 0 2px #000',
          transition: 'all 0.2s ease',
          opacity: isHovered ? 1 : 0,
        }}
      />
      <Handle
        type="target"
        position={Position.Top}
        style={{
          background: '#000',
          width: isHovered ? '12px' : '0px',
          height: isHovered ? '12px' : '0px',
          borderRadius: '50%',
          border: '2px solid white',
          boxShadow: '0 0 0 2px #000',
          transition: 'all 0.2s ease',
          opacity: isHovered ? 1 : 0,
          marginTop: '-4px',
        }}
      />

      {/* Bawah - Bisa jadi source atau target */}
      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          background: '#000',
          width: isHovered ? '12px' : '0px',
          height: isHovered ? '12px' : '0px',
          borderRadius: '50%',
          border: '2px solid white',
          boxShadow: '0 0 0 2px #000',
          transition: 'all 0.2s ease',
          opacity: isHovered ? 1 : 0,
        }}
      />
      <Handle
        type="target"
        position={Position.Bottom}
        style={{
          background: '#000',
          width: isHovered ? '12px' : '0px',
          height: isHovered ? '12px' : '0px',
          borderRadius: '50%',
          border: '2px solid white',
          boxShadow: '0 0 0 2px #000',
          transition: 'all 0.2s ease',
          opacity: isHovered ? 1 : 0,
          marginBottom: '-4px',
        }}
      />

      {/* Kiri - Bisa jadi source atau target */}
      <Handle
        type="source"
        position={Position.Left}
        style={{
          background: '#000',
          width: isHovered ? '12px' : '0px',
          height: isHovered ? '12px' : '0px',
          borderRadius: '50%',
          border: '2px solid white',
          boxShadow: '0 0 0 2px #000',
          transition: 'all 0.2s ease',
          opacity: isHovered ? 1 : 0,
        }}
      />
      <Handle
        type="target"
        position={Position.Left}
        style={{
          background: '#000',
          width: isHovered ? '12px' : '0px',
          height: isHovered ? '12px' : '0px',
          borderRadius: '50%',
          border: '2px solid white',
          boxShadow: '0 0 0 2px #000',
          transition: 'all 0.2s ease',
          opacity: isHovered ? 1 : 0,
          marginLeft: '-4px',
        }}
      />

      {/* Kanan - Bisa jadi source atau target */}
      <Handle
        type="source"
        position={Position.Right}
        style={{
          background: '#000',
          width: isHovered ? '12px' : '0px',
          height: isHovered ? '12px' : '0px',
          borderRadius: '50%',
          border: '2px solid white',
          boxShadow: '0 0 0 2px #000',
          transition: 'all 0.2s ease',
          opacity: isHovered ? 1 : 0,
        }}
      />
      <Handle
        type="target"
        position={Position.Right}
        style={{
          background: '#000',
          width: isHovered ? '12px' : '0px',
          height: isHovered ? '12px' : '0px',
          borderRadius: '50%',
          border: '2px solid white',
          boxShadow: '0 0 0 2px #000',
          transition: 'all 0.2s ease',
          opacity: isHovered ? 1 : 0,
          marginRight: '-4px',
        }}
      />

      {/* Label */}
      <div style={{ fontWeight: '600', fontSize: '14px', color: '#1f2937' }}>
        {data.label}
      </div>

      {/* Helper text saat hover */}
      {isHovered && (
        <div
          style={{
            position: 'absolute',
            bottom: '-24px',
            fontSize: '10px',
            color: '#6b7280',
            whiteSpace: 'nowrap',
          }}
        >
          Drag from points to connect
        </div>
      )}
    </div>
  );
}

export default memo(ShapeNode);
```

### 3. Buat Flow Chart Component dengan Hover Effect

Buat file `apps/web/components/FlowCell.tsx`:

```tsx
'use client';

import { useCallback, useState } from 'react';
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import ShapeNode from './ShapeNode';

const nodeTypes = {
  shape: ShapeNode,
};

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'shape',
    position: { x: 250, y: 50 },
    data: { label: 'Step 1' },
  },
  {
    id: '2',
    type: 'shape',
    position: { x: 100, y: 200 },
    data: { label: 'Step 2' },
  },
  {
    id: '3',
    type: 'shape',
    position: { x: 400, y: 200 },
    data: { label: 'Step 3' },
  },
  {
    id: '4',
    type: 'shape',
    position: { x: 250, y: 350 },
    data: { label: 'Step 4' },
  },
];

const initialEdges: Edge[] = [];

interface FlowCellProps {
  height?: string;
}

export default function FlowCell({ height = '400px' }: FlowCellProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [isHovered, setIsHovered] = useState(false);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({
      ...params,
      style: { stroke: '#000', strokeWidth: 2 },
      markerEnd: { type: 'arrowclosed', color: '#000' },
    }, eds)),
    [setEdges]
  );

  const defaultEdgeOptions = {
    style: { stroke: '#000', strokeWidth: 2 },
    markerEnd: { type: 'arrowclosed', color: '#000' },
  };

  return (
    <div
      className="flow-container"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        width: '100%',
        height: height,
        position: 'relative',
        borderRadius: '8px',
        overflow: 'hidden',
        background: isHovered ? '#f9fafb' : '#f3f4f6',
        transition: 'all 0.3s ease',
        cursor: isHovered ? 'default' : 'pointer',
      }}
    >
      {!isHovered && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            color: '#6b7280',
            pointerEvents: 'none',
          }}
        >
          <div style={{ fontSize: '16px', fontWeight: '500', marginBottom: '8px' }}>
            Hover to see flow chart
          </div>
          <div style={{ fontSize: '12px' }}>
            4 nodes with arrow connections
          </div>
        </div>
      )}

      <div
        style={{
          width: '100%',
          height: '100%',
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          defaultEdgeOptions={defaultEdgeOptions}
          fitView
        />
      </div>
    </div>
  );
}
```

### 4. Integrasikan ke Halaman

Update `apps/web/app/(dashboard)/sop-builder/page.tsx`:

```tsx
'use client';

import FlowCell from '@/components/FlowCell';

export default function SOPBuilderPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">SOP Builder</h1>

      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-4">Interactive Flow Chart</h2>
          <FlowCell height="500px" />
        </div>
      </div>
    </div>
  );
}
```

## Fitur Utama

1. **4 Connection Points per Shape**:
   - Atas (Top) - Bisa jadi source atau target
   - Bawah (Bottom) - Bisa jadi source atau target
   - Kiri (Left) - Bisa jadi source atau target
   - Kanan (Right) - Bisa jadi source atau target

2. **Hover Effect**:
   - Connection points (handles) hanya muncul saat di-hover pada shape
   - Semua handles berwarna hitam (#000) dengan border putih
   - Smooth transition animation dari size 0px ke 12px
   - Helper text muncul saat di-hover

3. **Arrow Connections**:
   - Node pertama yang diklik jadi source, node tujuan jadi target
   - Drag dari connection point (hitam) ke connection point di shape lain
   - Arrow berwarna hitam
   - Automatic bezier curve untuk connections
   - Supports connections dari semua arah (atas, bawah, kiri, kanan)

## Troubleshooting

### Connection points tidak muncul
- Pastikan hover state berfungsi dengan menambahkan console.log di onMouseEnter
- Cek apakah opacity transition berjalan dengan benar
- Verifikasi z-index handles tidak tertutup elemen lain
- Pastikan `@xyflow/react/dist/style.css` sudah di-import
- Cek apakah `nodeTypes` sudah terdaftar dengan benar

### Edges tidak ter-connect
- Pastikan Handle components ada di setiap sisi shape
- Verifikasi position (Top/Bottom/Left/Right) sudah benar
- Cek apakah type (source/target) sudah sesuai
- Pastikan ID unik untuk handles di posisi yang sama (left/right)

## Contoh Penggunaan

### Membuat connection antar shapes:
1. Hover ke shape untuk melihat 4 connection points (hitam)
2. Drag dari connection point satu ke connection point di shape lain
3. Arrow akan otomatis terbentuk dengan bezier curve

### Contoh connection:
- **Step 1 (bawah)** → **Step 2 (atas)**: Vertical connection
- **Step 1 (kanan)** → **Step 3 (kiri)**: Horizontal connection
- **Step 2 (kanan)** → **Step 3 (kiri)**: Horizontal connection
- **Step 2 (bawah)** → **Step 4 (atas)**: Vertical connection
- **Step 3 (bawah)** → **Step 4 (atas)**: Vertical connection

## Referensi
- [XYFlow Documentation](https://reactflow.dev/)
- [Context7 - XYFlow](https://context7.com/xyflow/xyflow)
- [Lucide React Icons](https://lucide.dev/)
