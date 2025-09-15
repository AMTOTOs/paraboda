import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { useCurrency } from '../../contexts/CurrencyContext';
import { StatsCard } from '../common/StatsCard';
import { ServiceRequestModal } from '../common/ServiceRequestModal';
import { RewardsModal } from '../common/RewardsModal';
import { CreditProfileCard } from '../wallet/CreditProfileCard';
import { LoanApplicationForm, MedicalLoanOptions, LoanPaymentForm } from '../wallet/loans';
import { AddSavingsForm } from '../wallet/AddSavingsForm';
import { SHAContributionForm, SHALoanRequestForm } from '../wallet/sha';
import { CreditReportModal } from '../wallet/CreditReportModal';
import { CreditCoachChat } from '../wallet/CreditCoachChat';
import {
  Wallet,
  Heart,
  Users,
  MapPin,
  Phone,
  Calendar,
  Star,
  TrendingUp,
  Shield,
  DollarSign,
  Plus,
  CreditCard,
  PiggyBank,
  FileText,
  AlertCircle,
  CheckCircle,
  Car,
  Stethoscope,
  Award,
  Activity,
  Brain,
  QrCode,
  Eye
} from 'lucide-react';

export const CaregiverDashboard: React.FC = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const { formatAmount } = useCurrency();
  const { addNotification, communityFunds } = useData();
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedLoanType, setSelectedLoanType] = useState<string>('');
  const [showCreditCoach, setShowCreditCoach] = useState(false);

  // User points for rewards
  const userPoints = user?.points || 150;

  // Mock wallet data
  const walletData = {
    balance: 15750,
    savings: Math.floor(communityFunds * 0.1),
    totalLoans: 2,
    activeLoans: 1,
    creditScore: Math.min(850, 300 + (userPoints * 2)),
    loanLimit: 25000,
    eligibilityStatus: user?.level === 'Gold' ? 'approved' : user?.level === 'Silver' ? 'pending' : 'not_assessed',
    loanReadiness: Math.min(100, 40 + userPoints / 10),
    trustLevel: user?.level === 'Platinum' ? 'platinum' : user?.level === 'Gold' ? 'gold' : user?.level === 'Silver' ? 'silver' : 'bronze',
    recentTransactions: [
      { id: 1, type: 'savings', amount: 1000, date: '2024-01-15', description: 'Monthly savings' },
      { id: 2, type: 'loan_payment', amount: -500, date: '2024-01-10', description: 'Medical loan payment' },
      { id: 3, type: 'reward', amount: 250, date: '2024-01-08', description: 'Community service reward' },
    ],
    activeLoansData: [
      {
        id: 1,
        type: 'Medical Emergency',
        amount: 5000,
        remaining: 2500,
        nextPayment: 500,
        dueDate: '2024-02-01',
        status: 'current'
      }
    ]
  };

  const handleModalClose = () => {
    setActiveModal(null);
    setSelectedLoanType('');
  };

  const handleModalSuccess = () => {
    handleModalClose();
  };

  const handleLoanApplication = (loanType: string) => {
    setSelectedLoanType(loanType);
    setActiveModal('loanApplication');
  };

  const handleServiceRequest = (serviceData: any) => {
    addNotification({
      title: language === 'sw' ? 'Ombi Limewasilishwa' : 'Request Submitted',
      message: language === 'sw' ? 'Ombi lako la huduma limewasilishwa' : 'Your service request has been submitted',
      type: 'success',
      read: false
    });
    setActiveModal(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-2xl shadow-lg p-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-5xl">👨‍👩‍👧‍👦</div>
            <div>
              <h1 className="text-2xl font-bold">
                {language === 'sw' ? `Karibu, ${user?.name}!` : `Welcome, ${user?.name}!`}
              </h1>
              <p className="text-green-100">
                {language === 'sw' 
                  ? 'Uongozi wa afya ya jamii yako'
                  : 'Managing your family\'s health and wellness'
                }
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">KES {walletData.balance.toLocaleString()}</div>
            <div className="text-green-100">{language === 'sw' ? 'Salio' : 'Balance'}</div>
          </div>
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - M-SUPU Wallet */}
        <div className="lg:col-span-2 space-y-6">
          {/* Wallet Overview */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <Wallet className="w-6 h-6 text-green-600" />
              <span>{language === 'sw' ? 'M-SUPU Pochi - Muhtasari' : 'M-SUPU Wallet - Overview'}</span>
            </h2>

            {/* Wallet Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <StatsCard
                title={language === 'sw' ? 'Akiba' : 'Savings'}
                value={`KES ${walletData.savings.toLocaleString()}`}
                icon={PiggyBank}
                color="green"
              />
              <StatsCard
                title={language === 'sw' ? 'Alama za Mkopo' : 'Credit Score'}
                value={walletData.creditScore.toString()}
                icon={TrendingUp}
                color="blue"
              />
              <StatsCard
                title={language === 'sw' ? 'Mikopo Hai' : 'Active Loans'}
                value={walletData.activeLoans.toString()}
                icon={CreditCard}
                color="orange"
              />
              <StatsCard
                title={language === 'sw' ? 'Kiwango cha Mkopo' : 'Loan Limit'}
                value={`KES ${walletData.loanLimit.toLocaleString()}`}
                icon={Shield}
                color="purple"
              />
            </div>

            <CreditProfileCard
              creditScore={walletData.creditScore}
              savingsBalance={walletData.savings}
              eligibilityStatus={walletData.eligibilityStatus as any}
              loanReadiness={walletData.loanReadiness}
              trustLevel={walletData.trustLevel as any}
            />
          </motion.div>

          {/* Active Loans */}
          {walletData.activeLoansData.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <CreditCard className="w-6 h-6 text-orange-600" />
                <span>{language === 'sw' ? 'Mikopo Hai' : 'Active Loans'}</span>
              </h3>

              <div className="space-y-4">
                {walletData.activeLoansData.map((loan) => (
                  <div key={loan.id} className="border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">{loan.type}</h4>
                        <div className="text-sm text-gray-600 space-y-1">
                          <div>{language === 'sw' ? 'Kiasi' : 'Amount'}: KES {loan.amount.toLocaleString()}</div>
                          <div>{language === 'sw' ? 'Kimebaki' : 'Remaining'}: KES {loan.remaining.toLocaleString()}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`px-3 py-1 text-sm font-semibold rounded-full ${
                          loan.status === 'current' 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {loan.status === 'current' 
                            ? (language === 'sw' ? 'Sawa' : 'Current')
                            : (language === 'sw' ? 'Kuchelewa' : 'Overdue')
                          }
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {language === 'sw' ? 'Tarehe' : 'Due'}: {loan.dueDate}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Right Column - Quick Actions & Services */}
        <div className="lg:col-span-1 space-y-6">
          {/* Wallet Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {language === 'sw' ? 'Vitendo vya Haraka' : 'Quick Actions'}
            </h3>

            <div className="space-y-3">
              <button
                onClick={() => setActiveModal('medicalLoanOptions')}
                className="w-full p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg min-h-[60px]"
              >
                <div className="flex items-center space-x-3">
                  <DollarSign className="w-6 h-6" />
                  <div className="text-left">
                    <div className="font-semibold">{language === 'sw' ? 'Omba Mkopo' : 'Apply for Loan'}</div>
                    <div className="text-sm opacity-90">{language === 'sw' ? 'Matibabu na usafiri' : 'Medical & transport'}</div>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setActiveModal('addSavings')}
                className="w-full p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105 shadow-lg min-h-[60px]"
              >
                <div className="flex items-center space-x-3">
                  <Plus className="w-6 h-6" />
                  <div className="text-left">
                    <div className="font-semibold">{language === 'sw' ? 'Ongeza Akiba' : 'Add Savings'}</div>
                    <div className="text-sm opacity-90">{language === 'sw' ? 'Hifadhi ya jamii' : 'Community savings'}</div>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setActiveModal('loanPayment')}
                className="w-full p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg min-h-[60px]"
              >
                <div className="flex items-center space-x-3">
                  <CreditCard className="w-6 h-6" />
                  <div className="text-left">
                    <div className="font-semibold">{language === 'sw' ? 'Lipa Mkopo' : 'Loan Payment'}</div>
                    <div className="text-sm opacity-90">{language === 'sw' ? 'Malipo ya mkopo' : 'Repay loan'}</div>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setActiveModal('creditReport')}
                className="w-full p-4 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-xl hover:from-indigo-600 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg min-h-[60px]"
              >
                <div className="flex items-center space-x-3">
                  <FileText className="w-6 h-6" />
                  <div className="text-left">
                    <div className="font-semibold">{language === 'sw' ? 'Ripoti ya Mkopo' : 'Credit Report'}</div>
                    <div className="text-sm opacity-90">{language === 'sw' ? 'Historia na alama' : 'History & score'}</div>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setShowCreditCoach(true)}
                className="w-full p-4 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl hover:from-pink-600 hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg min-h-[60px]"
              >
                <div className="flex items-center space-x-3">
                  <Brain className="w-6 h-6" />
                  <div className="text-left">
                    <div className="font-semibold">{language === 'sw' ? 'Mkocha wa Mkopo' : 'Credit Coach'}</div>
                    <div className="text-sm opacity-90">{language === 'sw' ? 'Ushauri wa kifedha' : 'Financial advice'}</div>
                  </div>
                </div>
              </button>
            </div>
          </motion.div>

          {/* SHA Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  {language === 'sw' ? 'SHA' : 'Social Health Insurance'}
                </h3>
                <p className="text-sm text-gray-600">
                  {language === 'sw' ? 'Bima ya afya ya jamii' : 'Community health insurance'}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => setActiveModal('shaContribution')}
                className="w-full p-4 border-2 border-blue-200 rounded-xl hover:border-blue-400 transition-colors text-left min-h-[60px]"
              >
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                  <div>
                    <div className="font-bold text-gray-900">{language === 'sw' ? 'Jiunge & Changia' : 'Register & Contribute'}</div>
                    <div className="text-sm text-gray-600">{language === 'sw' ? 'Kutoka akiba' : 'From savings'}</div>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setActiveModal('shaLoanRequest')}
                className="w-full p-4 border-2 border-green-200 rounded-xl hover:border-green-400 transition-colors text-left min-h-[60px]"
              >
                <div className="flex items-center space-x-3">
                  <DollarSign className="w-6 h-6 text-green-600" />
                  <div>
                    <div className="font-bold text-gray-900">{language === 'sw' ? 'Omba Mkopo wa SHA' : 'Request SHA Loan'}</div>
                    <div className="text-sm text-gray-600">{language === 'sw' ? 'Kwa kujiunga' : 'For registration'}</div>
                  </div>
                </div>
              </button>
            </div>
          </motion.div>

          {/* Health Services */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <Stethoscope className="w-5 h-5 text-blue-600" />
              <span>{language === 'sw' ? 'Huduma za Afya' : 'Health Services'}</span>
            </h3>
            
            <div className="grid grid-cols-1 gap-3">
              <button
                onClick={() => setActiveModal('serviceRequest')}
                className="p-4 bg-pink-50 border-2 border-pink-200 rounded-xl hover:bg-pink-100 transition-colors text-left min-h-[60px]"
              >
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">🤱</div>
                  <div>
                    <div className="font-bold text-gray-900">{language === 'sw' ? 'Huduma za Mimba' : 'Antenatal Care'}</div>
                    <div className="text-sm text-gray-600">{language === 'sw' ? 'ANC na PNC' : 'ANC & PNC visits'}</div>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setActiveModal('serviceRequest')}
                className="p-4 bg-blue-50 border-2 border-blue-200 rounded-xl hover:bg-blue-100 transition-colors text-left min-h-[60px]"
              >
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">💉</div>
                  <div>
                    <div className="font-bold text-gray-900">{language === 'sw' ? 'Chanjo za Watoto' : 'Child Vaccinations'}</div>
                    <div className="text-sm text-gray-600">{language === 'sw' ? 'Chanjo za kawaida' : 'Routine vaccines'}</div>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setActiveModal('emergencyTransport')}
                className="p-4 bg-red-50 border-2 border-red-200 rounded-xl hover:bg-red-100 transition-colors text-left min-h-[60px]"
              >
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">🚨</div>
                  <div>
                    <div className="font-bold text-gray-900">{language === 'sw' ? 'Usafiri wa Dharura' : 'Emergency Transport'}</div>
                    <div className="text-sm text-gray-600">{language === 'sw' ? 'Msaada wa haraka' : 'Urgent assistance'}</div>
                  </div>
                </div>
              </button>
            </div>
          </motion.div>

          {/* Community Rewards */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <Award className="w-5 h-5 text-yellow-600" />
              <span>{language === 'sw' ? 'Zawadi za Jamii' : 'Community Rewards'}</span>
            </h3>
            
            <div className="text-center p-4 bg-yellow-50 rounded-xl mb-4">
              <div className="text-3xl font-bold text-yellow-600 mb-2">{userPoints}</div>
              <p className="text-yellow-800 font-medium">{language === 'sw' ? 'Pointi Zako' : 'Your Points'}</p>
            </div>

            <button
              onClick={() => setActiveModal('rewards')}
              className="w-full bg-yellow-600 text-white py-3 rounded-xl hover:bg-yellow-700 transition-colors font-bold"
            >
              {language === 'sw' ? 'Ona Zawadi' : 'View Rewards'}
            </button>
          </motion.div>
        </div>
      </div>

      {/* Modals */}
      <MedicalLoanOptions
        isOpen={activeModal === 'medicalLoanOptions'}
        onClose={handleModalClose}
        onLoanSelect={handleLoanApplication}
      />

      <LoanApplicationForm
        isOpen={activeModal === 'loanApplication'}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
        loanType={selectedLoanType}
      />

      <AddSavingsForm
        isOpen={activeModal === 'addSavings'}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
        currentBalance={walletData.balance}
      />

      <LoanPaymentForm
        isOpen={activeModal === 'loanPayment'}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
      />

      <CreditReportModal
        isOpen={activeModal === 'creditReport'}
        onClose={handleModalClose}
      />

      <SHAContributionForm
        isOpen={activeModal === 'shaContribution'}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
        currentBalance={walletData.savings}
      />

      <SHALoanRequestForm
        isOpen={activeModal === 'shaLoanRequest'}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
      />

      <ServiceRequestModal
        isOpen={activeModal === 'emergencyTransport' || activeModal === 'serviceRequest'}
        onClose={handleModalClose}
        onRequest={handleServiceRequest}
        serviceType="transport"
      />

      <RewardsModal
        isOpen={activeModal === 'rewards'}
        onClose={handleModalClose}
        userPoints={userPoints}
        onRedeem={(item) => {
          console.log('Reward redeemed:', item);
          handleModalClose();
        }}
      />

      <CreditCoachChat
        isOpen={showCreditCoach}
        onClose={() => setShowCreditCoach(false)}
        userCreditScore={walletData.creditScore}
        userSavings={walletData.savings}
      />
    </div>
  );
};