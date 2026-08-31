// Inline SVG icons to avoid react-icons bundle bloat
// These replace: AiOutlinePlus, FiEdit, FaRegTrashAlt

interface IconProps {
  size?: number;
  color?: string;
  className?: string;
}

// AiOutlinePlus - Ant Design Plus icon
export const PlusIcon = ({ size = 24, color = "currentColor", className }: IconProps) => (
  <svg
    stroke={color}
    fill={color}
    strokeWidth="0"
    viewBox="0 0 1024 1024"
    height={size}
    width={size}
    className={className}
  >
    <path d="M482 152h60q8 0 8 8v704q0 8-8 8h-60q-8 0-8-8V160q0-8 8-8Z" />
    <path d="M176 474h672q8 0 8 8v60q0 8-8 8H176q-8 0-8-8v-60q0-8 8-8Z" />
  </svg>
);

// FiEdit - Feather Edit icon
export const EditIcon = ({ size = 24, color = "currentColor", className }: IconProps) => (
  <svg
    stroke={color}
    fill="none"
    strokeWidth="2"
    viewBox="0 0 24 24"
    strokeLinecap="round"
    strokeLinejoin="round"
    height={size}
    width={size}
    className={className}
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

// FaRegTrashAlt - Font Awesome Trash icon
export const TrashIcon = ({ size = 24, color = "currentColor", className }: IconProps) => (
  <svg
    stroke={color}
    fill={color}
    strokeWidth="0"
    viewBox="0 0 448 512"
    height={size}
    width={size}
    className={className}
  >
    <path d="M32 464a48 48 0 0 0 48 48h288a48 48 0 0 0 48-48V128H32zm272-256a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zm-96 0a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zm-96 0a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zM432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16z" />
  </svg>
);
