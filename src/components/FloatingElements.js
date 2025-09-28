import React from 'react';
import { TrendingUp, DollarSign, BarChart3, PieChart, Activity } from 'lucide-react';

const FloatingElements = ({ isDark }) => {
  const icons = [TrendingUp, DollarSign, BarChart3, PieChart, Activity];

  return (
    <div className="floating-elements">
      {icons.map((Icon, index) => (
        <div
          key={index}
          className={`floating-icon floating-icon-${index + 1}`}
          style={{
            animationDelay: `${index * 0.5}s`,
            left: `${10 + index * 20}%`,
            top: `${20 + (index % 2) * 40}%`
          }}
        >
          <Icon size={24} />
        </div>
      ))}

      <style jsx>{`
        .floating-elements {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: -1;
          overflow: hidden;
        }

        .floating-icon {
          position: absolute;
          color: ${isDark ? 'rgba(37, 99, 235, 0.08)' : 'rgba(37, 99, 235, 0.03)'};
          animation: float 6s ease-in-out infinite;
        }

        .floating-icon-1 {
          animation-duration: 6s;
        }

        .floating-icon-2 {
          animation-duration: 8s;
          animation-direction: reverse;
        }

        .floating-icon-3 {
          animation-duration: 7s;
        }

        .floating-icon-4 {
          animation-duration: 9s;
          animation-direction: reverse;
        }

        .floating-icon-5 {
          animation-duration: 5s;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.3;
          }
          25% {
            transform: translateY(-20px) rotate(90deg);
            opacity: 0.6;
          }
          50% {
            transform: translateY(-40px) rotate(180deg);
            opacity: 0.3;
          }
          75% {
            transform: translateY(-20px) rotate(270deg);
            opacity: 0.6;
          }
        }

        @media (max-width: 768px) {
          .floating-icon {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default FloatingElements;