import { ImageResponse } from 'next/og';
import { Leaf } from 'lucide-react';

export const runtime = 'edge';
export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 24,
          background: '#E5EBE5', // Very light green background
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
        }}
      >
        <Leaf style={{ color: '#B2D7B2' }} size={24} />
      </div>
    ),
    {
      ...size,
    }
  );
}
