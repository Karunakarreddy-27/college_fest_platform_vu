import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Copy,
  Shield,
  Upload
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const FEST_FEE_AMOUNT = 500;
const STATIC_PAYMENT_QR = '/qr.png.jpeg';

const PaymentPage = () => {
  const { api, user, updateUser } = useAuth();

  const [qrDetails, setQrDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [utrNumber, setUtrNumber] = useState('');
  const [screenshotDataUrl, setScreenshotDataUrl] = useState('');
  const [screenshotName, setScreenshotName] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [latestPayment, setLatestPayment] = useState(null);
  const [statusBanner, setStatusBanner] = useState({ type: '', message: '' });
  const [useGeneratedQr, setUseGeneratedQr] = useState(false);

  const previousStatusRef = useRef('');

  const syncAuthUser = useCallback((serverUser) => {
    if (!serverUser || !user) return;

    const nextUser = {
      ...user,
      paymentStatus: serverUser.paymentStatus ?? user.paymentStatus,
      paymentId: serverUser.paymentId ?? user.paymentId,
      paymentAmount: serverUser.paymentAmount ?? user.paymentAmount,
      qrCode: serverUser.qrCode ?? user.qrCode
    };

    const hasUserChanges =
      nextUser.paymentStatus !== user.paymentStatus ||
      nextUser.paymentId !== user.paymentId ||
      nextUser.paymentAmount !== user.paymentAmount ||
      nextUser.qrCode !== user.qrCode;

    if (hasUserChanges) {
      updateUser(nextUser);
    }
  }, [updateUser, user]);

  const loadPageData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const [qrResponse, statusResponse] = await Promise.all([
        api.get('/payments/manual/qr'),
        api.get('/payments/manual/fest-fee/status')
      ]);

      setQrDetails(qrResponse.data?.payment || null);
      setLatestPayment(statusResponse.data?.payment || null);
      syncAuthUser(statusResponse.data?.user);
    } catch (loadError) {
      if (loadError.response?.status === 401) {
        setError('Session expired. Please log in again.');
      } else if (loadError.response?.status === 403) {
        setError('You do not have permission to access payment details.');
      } else if (loadError.code === 'ERR_NETWORK') {
        setError('Backend is not reachable. Start backend on port 5000 and retry.');
      } else if (loadError.response?.status === 404) {
        setError('Payment API route not found. Restart backend to load latest routes.');
      } else if (typeof loadError.response?.data === 'string' && loadError.response.data.trim()) {
        setError(loadError.response.data);
      } else {
        setError(loadError.response?.data?.message || 'Could not load payment details. Please check that the backend is running.');
      }
    } finally {
      setLoading(false);
    }
  }, [api, syncAuthUser]);

  useEffect(() => {
    loadPageData();
  }, [loadPageData]);

  useEffect(() => {
    if (!latestPayment || !['pending', 'processing'].includes(latestPayment.status)) {
      previousStatusRef.current = latestPayment?.status || '';
      return;
    }

    let isMounted = true;
    let intervalId;

    const pollStatus = async () => {
      try {
        const response = await api.get(`/payments/${latestPayment.transactionId}/status`);
        if (!isMounted) return;

        const nextPayment = response.data?.payment || null;
        if (nextPayment) {
          setLatestPayment(nextPayment);
        }

        syncAuthUser(response.data?.user);

        const previousStatus = previousStatusRef.current;
        const currentStatus = nextPayment?.status || '';

        if (previousStatus !== currentStatus) {
          if (currentStatus === 'completed') {
            setStatusBanner({
              type: 'success',
              message: 'Payment approved. You can now register for any event.'
            });
          } else if (currentStatus === 'failed') {
            setStatusBanner({
              type: 'error',
              message: 'Payment was rejected. Please submit a new proof.'
            });
          }
        }

        previousStatusRef.current = currentStatus;

        if (['completed', 'failed'].includes(currentStatus)) {
          clearInterval(intervalId);
        }
      } catch (pollError) {
        if (!isMounted) return;
      }
    };

    pollStatus();
    intervalId = setInterval(pollStatus, 5000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [api, latestPayment, syncAuthUser]);

  const handleScreenshotChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file.');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError('Payment screenshot must be under 2 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setScreenshotDataUrl(reader.result);
      setScreenshotName(file.name);
      setError('');
    };
    reader.readAsDataURL(file);
  };

  const submitPaymentProof = async () => {
    if (!utrNumber.trim()) {
      setError('Please enter the UTR number.');
      return;
    }

    if (!screenshotDataUrl) {
      setError('Please upload the payment screenshot.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await api.post('/payments/manual/fest-fee', {
        utrNumber,
        screenshotDataUrl,
        notes
      });

      const payment = response.data?.payment || null;
      setLatestPayment(payment);
      previousStatusRef.current = payment?.status || '';

      setStatusBanner({
        type: 'info',
        message: 'Payment proof submitted. Waiting for admin verification.'
      });

      setUtrNumber('');
      setScreenshotDataUrl('');
      setScreenshotName('');
      setNotes('');
    } catch (submitError) {
      const statusCode = submitError.response?.status;
      const serverMessage = submitError.response?.data?.message;
      const plainResponse = typeof submitError.response?.data === 'string' ? submitError.response.data : '';

      if (statusCode === 401) {
        setError('Session expired. Please log in again.');
      } else if (statusCode === 403) {
        setError(serverMessage || 'You do not have permission to submit payment proof.');
      } else if (submitError.code === 'ERR_NETWORK') {
        setError('Backend is not reachable. Start backend on port 5000 and retry.');
      } else if (statusCode === 404 || (serverMessage && serverMessage.toLowerCase().includes('route not found'))) {
        setError('Payment API route not found. Restart backend and try again.');
      } else if (statusCode === 413) {
        setError('Image payload is too large for backend. Use a smaller screenshot and retry.');
      } else if (plainResponse.trim()) {
        setError(plainResponse);
      } else {
        setError(serverMessage || `Could not submit payment proof (status ${statusCode || 'network error'}).`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyUpiId = async () => {
    if (!qrDetails?.upiId) return;
    await navigator.clipboard.writeText(qrDetails.upiId);
  };

  const paymentAlreadyCompleted = user?.paymentStatus === 'paid' || latestPayment?.status === 'completed';
  const paymentPending = latestPayment && ['pending', 'processing'].includes(latestPayment.status);
  const paymentFailed = latestPayment?.status === 'failed';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading payment details..." />
      </div>
    );
  }

  if (paymentAlreadyCompleted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-20">
        <motion.div
          className="glass rounded-xl p-8 max-w-lg w-full text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-9 h-9 text-green-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">Payment Completed</h1>
          <p className="text-gray-400 mb-6">
            Your one-time fest payment is confirmed. You can now register for any event.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              to="/events"
              className="px-5 py-3 bg-gradient-to-r from-neon-blue to-neon-purple text-white rounded-lg btn-glow"
            >
              Browse Events
            </Link>
            <Link
              to="/dashboard"
              className="px-5 py-3 glass rounded-lg hover:bg-white/10 transition-colors"
            >
              Go to Dashboard
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
            One-Time Fest Payment
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Pay once to unlock registration for all events.
          </p>
        </motion.div>

        {(statusBanner.message || paymentPending || paymentFailed) && (
          <motion.div
            className={`mb-6 rounded-lg border p-4 flex items-start gap-3 ${
              paymentPending || statusBanner.type === 'info'
                ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300'
                : paymentFailed || statusBanner.type === 'error'
                  ? 'bg-red-500/10 border-red-500/30 text-red-300'
                  : 'bg-green-500/10 border-green-500/30 text-green-300'
            }`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {paymentPending || statusBanner.type === 'info' ? (
              <Clock className="w-5 h-5 mt-0.5 flex-shrink-0" />
            ) : paymentFailed || statusBanner.type === 'error' ? (
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            ) : (
              <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            )}
            <div className="text-sm">
              {statusBanner.message || (
                paymentPending
                  ? 'Payment proof submitted. Waiting for admin verification.'
                  : paymentFailed
                    ? 'Previous payment proof was rejected. Submit again with correct details.'
                    : ''
              )}
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="glass rounded-xl p-6 md:p-8">
              <h2 className="text-2xl font-bold text-white mb-5">Submit Payment Proof</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    UTR Number
                  </label>
                  <input
                    type="text"
                    value={utrNumber}
                    onChange={(event) => setUtrNumber(event.target.value)}
                    className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-lg text-white focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue"
                    placeholder="Enter UTR / transaction reference"
                    disabled={paymentPending || isSubmitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Payment Screenshot
                  </label>
                  <label className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-lg text-white cursor-pointer hover:border-neon-blue transition-colors flex items-center gap-2">
                    <Upload className="w-5 h-5 text-neon-blue" />
                    <span className="truncate">{screenshotName || 'Upload image'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleScreenshotChange}
                      className="hidden"
                      disabled={paymentPending || isSubmitting}
                    />
                  </label>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-lg text-white focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue"
                  rows={2}
                  maxLength={500}
                  placeholder="Optional"
                  disabled={paymentPending || isSubmitting}
                />
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                  <span className="text-red-300 text-sm">{error}</span>
                </div>
              )}

              <button
                type="button"
                onClick={submitPaymentProof}
                disabled={isSubmitting || paymentPending}
                className="w-full px-6 py-4 bg-gradient-to-r from-neon-blue to-neon-purple text-white rounded-lg font-semibold btn-glow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <LoadingSpinner size="sm" text="" />
                    <span>Submitting...</span>
                  </>
                ) : paymentPending ? (
                  <>
                    <Clock className="w-5 h-5" />
                    <span>Waiting For Verification</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span>Submit Payment Proof</span>
                  </>
                )}
              </button>

              <div className="mt-5 flex items-center justify-center gap-2 text-gray-400 text-sm">
                <Shield className="w-4 h-4" />
                <span>This is a one-time payment. Event registration unlocks after admin approval.</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="glass rounded-xl p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-white mb-5">Scan and Pay</h2>

              {(qrDetails?.qrCode || STATIC_PAYMENT_QR) && (
                <div className="bg-white rounded-lg p-4 mb-5">
                  <img
                    src={useGeneratedQr ? qrDetails?.qrCode : STATIC_PAYMENT_QR}
                    alt="UPI payment QR"
                    className="w-full aspect-square object-contain"
                    onError={() => setUseGeneratedQr(true)}
                  />
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4 text-gray-300">
                  <span>Amount</span>
                  <span className="text-green-400 font-bold">Rs. {FEST_FEE_AMOUNT}</span>
                </div>
                <div className="flex items-center justify-between gap-4 text-gray-300">
                  <span>UPI ID</span>
                  <button
                    type="button"
                    onClick={copyUpiId}
                    className="text-neon-blue font-mono text-sm flex items-center gap-2"
                  >
                    {qrDetails?.upiId}
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between gap-4 text-gray-300">
                  <span>Payee</span>
                  <span className="text-white">{qrDetails?.payeeName}</span>
                </div>
              </div>

              {latestPayment && (
                <div className="mt-6 border-t border-dark-border pt-5 space-y-3 text-sm">
                  <div className="flex items-center justify-between gap-4 text-gray-300">
                    <span>Last UTR</span>
                    <span className="text-neon-blue font-mono text-right">{latestPayment.utrNumber}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4 text-gray-300">
                    <span>Status</span>
                    <span
                      className={`font-semibold capitalize ${
                        latestPayment.status === 'completed'
                          ? 'text-green-400'
                          : latestPayment.status === 'failed'
                            ? 'text-red-400'
                            : 'text-yellow-400'
                      }`}
                    >
                      {latestPayment.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4 text-gray-300">
                    <span>Transaction</span>
                    <span className="text-white text-right">{latestPayment.transactionId}</span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
