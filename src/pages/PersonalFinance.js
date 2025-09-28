import React, { useState, memo } from 'react';
import { Calculator, PiggyBank, TrendingUp, Home, Car, CreditCard, Target, DollarSign, BarChart3, Wallet } from 'lucide-react';

const PersonalFinance = memo(() => {
  const [activeCalculator, setActiveCalculator] = useState('sip');
  const [sipAmount, setSipAmount] = useState(5000);
  const [sipRate, setSipRate] = useState(12);
  const [sipYears, setSipYears] = useState(10);
  const [loanAmount, setLoanAmount] = useState(1000000);
  const [loanRate, setLoanRate] = useState(8.5);
  const [loanYears, setLoanYears] = useState(20);

  const calculators = [
    { id: 'sip', name: 'SIP Calculator', icon: TrendingUp, color: '#10b981' },
    { id: 'loan', name: 'Loan EMI', icon: Home, color: '#f59e0b' },
    { id: 'fd', name: 'FD Calculator', icon: PiggyBank, color: '#3b82f6' },
    { id: 'retirement', name: 'Retirement', icon: Target, color: '#8b5cf6' }
  ];

  const calculateSIP = () => {
    const monthlyRate = sipRate / 100 / 12;
    const months = sipYears * 12;
    const futureValue = sipAmount * (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate));
    const invested = sipAmount * months;
    const returns = futureValue - invested;
    return { futureValue, invested, returns };
  };

  const calculateEMI = () => {
    const monthlyRate = loanRate / 100 / 12;
    const months = loanYears * 12;
    const emi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    const totalAmount = emi * months;
    const interest = totalAmount - loanAmount;
    return { emi, totalAmount, interest };
  };

  const sipResult = calculateSIP();
  const emiResult = calculateEMI();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const tools = [
    { name: 'Budget Tracker', icon: Wallet, desc: 'Track income & expenses' },
    { name: 'Goal Planner', icon: Target, desc: 'Plan financial goals' },
    { name: 'Tax Calculator', icon: Calculator, desc: 'Calculate tax liability' },
    { name: 'Credit Score', icon: CreditCard, desc: 'Check credit health' },
    { name: 'Investment Tracker', icon: BarChart3, desc: 'Monitor portfolio' },
    { name: 'Insurance Calculator', icon: Home, desc: 'Calculate coverage' }
  ];

  return (
    <div className="personal-finance">
      <div className="container">
        <div className="page-header">
          <h1>Personal Finance Tools</h1>
          <p>Smart financial planning made simple</p>
        </div>

        <div className="calculators-section">
          <div className="calculator-tabs">
            {calculators.map((calc) => (
              <button
                key={calc.id}
                onClick={() => setActiveCalculator(calc.id)}
                className={`calc-tab ${activeCalculator === calc.id ? 'active' : ''}`}
                style={{ '--calc-color': calc.color }}
              >
                <calc.icon size={20} />
                <span>{calc.name}</span>
              </button>
            ))}
          </div>

          <div className="calculator-content">
            {activeCalculator === 'sip' && (
              <div className="calculator-card">
                <h3>SIP Calculator</h3>
                <div className="calc-inputs">
                  <div className="input-group">
                    <label>Monthly Investment</label>
                    <input
                      type="number"
                      value={sipAmount}
                      onChange={(e) => setSipAmount(Number(e.target.value))}
                      className="calc-input"
                    />
                  </div>
                  <div className="input-group">
                    <label>Expected Return (%)</label>
                    <input
                      type="number"
                      value={sipRate}
                      onChange={(e) => setSipRate(Number(e.target.value))}
                      className="calc-input"
                      step="0.1"
                    />
                  </div>
                  <div className="input-group">
                    <label>Investment Period (Years)</label>
                    <input
                      type="number"
                      value={sipYears}
                      onChange={(e) => setSipYears(Number(e.target.value))}
                      className="calc-input"
                    />
                  </div>
                </div>
                <div className="calc-results">
                  <div className="result-item">
                    <span>Total Investment</span>
                    <span className="amount">{formatCurrency(sipResult.invested)}</span>
                  </div>
                  <div className="result-item">
                    <span>Expected Returns</span>
                    <span className="amount gain">{formatCurrency(sipResult.returns)}</span>
                  </div>
                  <div className="result-item total">
                    <span>Maturity Value</span>
                    <span className="amount">{formatCurrency(sipResult.futureValue)}</span>
                  </div>
                </div>
              </div>
            )}

            {activeCalculator === 'loan' && (
              <div className="calculator-card">
                <h3>Loan EMI Calculator</h3>
                <div className="calc-inputs">
                  <div className="input-group">
                    <label>Loan Amount</label>
                    <input
                      type="number"
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(Number(e.target.value))}
                      className="calc-input"
                    />
                  </div>
                  <div className="input-group">
                    <label>Interest Rate (%)</label>
                    <input
                      type="number"
                      value={loanRate}
                      onChange={(e) => setLoanRate(Number(e.target.value))}
                      className="calc-input"
                      step="0.1"
                    />
                  </div>
                  <div className="input-group">
                    <label>Loan Tenure (Years)</label>
                    <input
                      type="number"
                      value={loanYears}
                      onChange={(e) => setLoanYears(Number(e.target.value))}
                      className="calc-input"
                    />
                  </div>
                </div>
                <div className="calc-results">
                  <div className="result-item">
                    <span>Monthly EMI</span>
                    <span className="amount">{formatCurrency(emiResult.emi)}</span>
                  </div>
                  <div className="result-item">
                    <span>Total Interest</span>
                    <span className="amount loss">{formatCurrency(emiResult.interest)}</span>
                  </div>
                  <div className="result-item total">
                    <span>Total Amount</span>
                    <span className="amount">{formatCurrency(emiResult.totalAmount)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="tools-section">
          <h2>Financial Tools</h2>
          <div className="tools-grid">
            {tools.map((tool, index) => (
              <div key={index} className="tool-card">
                <div className="tool-icon">
                  <tool.icon size={24} />
                </div>
                <h3>{tool.name}</h3>
                <p>{tool.desc}</p>
                <button className="tool-btn">Use Tool</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .personal-finance {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          padding: 2rem 0;
        }

        body.dark .personal-finance {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
        }

        .page-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .page-header h1 {
          font-size: 2.5rem;
          font-weight: 700;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 0.5rem;
        }

        .page-header p {
          color: #6b7280;
          font-size: 1.1rem;
        }

        body.dark .page-header p {
          color: #9ca3af;
        }

        .calculators-section {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(20px);
          border-radius: 1rem;
          padding: 2rem;
          margin-bottom: 3rem;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }

        body.dark .calculators-section {
          background: rgba(30, 41, 59, 0.9);
        }

        .calculator-tabs {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }

        .calc-tab {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          border: 2px solid #e5e7eb;
          background: white;
          border-radius: 0.75rem;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 500;
        }

        body.dark .calc-tab {
          background: #374151;
          border-color: #4b5563;
          color: #d1d5db;
        }

        .calc-tab:hover {
          border-color: var(--calc-color);
          color: var(--calc-color);
        }

        .calc-tab.active {
          background: var(--calc-color);
          border-color: var(--calc-color);
          color: white;
        }

        .calculator-card {
          background: #f8fafc;
          border-radius: 0.75rem;
          padding: 2rem;
        }

        body.dark .calculator-card {
          background: #1e293b;
        }

        .calculator-card h3 {
          margin-bottom: 1.5rem;
          color: #1f2937;
          font-size: 1.25rem;
        }

        body.dark .calculator-card h3 {
          color: #f9fafb;
        }

        .calc-inputs {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .input-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #374151;
        }

        body.dark .input-group label {
          color: #d1d5db;
        }

        .calc-input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          font-size: 1rem;
        }

        body.dark .calc-input {
          background: #374151;
          border-color: #4b5563;
          color: #f9fafb;
        }

        .calc-results {
          background: white;
          border-radius: 0.5rem;
          padding: 1.5rem;
          border: 1px solid #e5e7eb;
        }

        body.dark .calc-results {
          background: #374151;
          border-color: #4b5563;
        }

        .result-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 0;
          border-bottom: 1px solid #f3f4f6;
        }

        body.dark .result-item {
          border-bottom-color: #4b5563;
        }

        .result-item:last-child {
          border-bottom: none;
        }

        .result-item.total {
          font-weight: 600;
          font-size: 1.1rem;
          border-top: 2px solid #e5e7eb;
          margin-top: 0.5rem;
          padding-top: 1rem;
        }

        body.dark .result-item.total {
          border-top-color: #4b5563;
        }

        .amount {
          font-weight: 600;
          font-size: 1.1rem;
        }

        .amount.gain {
          color: #10b981;
        }

        .amount.loss {
          color: #ef4444;
        }

        .tools-section h2 {
          text-align: center;
          margin-bottom: 2rem;
          font-size: 2rem;
          color: #1f2937;
        }

        body.dark .tools-section h2 {
          color: #f9fafb;
        }

        .tools-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
        }

        .tool-card {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(20px);
          border-radius: 1rem;
          padding: 2rem;
          text-align: center;
          transition: all 0.3s ease;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        body.dark .tool-card {
          background: rgba(30, 41, 59, 0.9);
          border-color: rgba(55, 65, 81, 0.3);
        }

        .tool-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }

        .tool-icon {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
          color: white;
        }

        .tool-card h3 {
          margin-bottom: 0.5rem;
          color: #1f2937;
        }

        body.dark .tool-card h3 {
          color: #f9fafb;
        }

        .tool-card p {
          color: #6b7280;
          margin-bottom: 1.5rem;
        }

        body.dark .tool-card p {
          color: #9ca3af;
        }

        .tool-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .tool-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
        }

        @media (max-width: 768px) {
          .page-header h1 {
            font-size: 2rem;
          }

          .calculators-section {
            padding: 1.5rem;
          }

          .calc-inputs {
            grid-template-columns: 1fr;
          }

          .calculator-tabs {
            justify-content: center;
          }

          .calc-tab {
            padding: 0.5rem 1rem;
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  );
});

PersonalFinance.displayName = 'PersonalFinance';

export default PersonalFinance;