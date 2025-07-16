const { useState, useEffect, useRef } = React;

// WebsimSocket is commented out for local debugging
// const room = new WebsimSocket();
// const FEEDBACK_COLLECTION = 'feedback_v3';

// Dummy data for local testing
const initialFeedback = [
    {
        id: 1,
        type: 'اقتراح',
        department: 'تقنية المعلومات',
        message: 'نقترح توفير شاشات إضافية للمطورين لزيادة الإنتاجية.',
        author: 'علياء',
        timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        file_url: null
    },
    {
        id: 2,
        type: 'شكوى',
        department: 'الموارد البشرية',
        message: 'مكيف الهواء في الطابق الثالث لا يعمل بشكل جيد، مما يؤثر على جو العمل.',
        author: 'مجهول',
        timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        file_url: null
    }
];

function App() {
    // The state for feedback is kept for potential future use, but not displayed.
    const [allFeedback, setAllFeedback] = useState(initialFeedback);

    const handleNewFeedback = (feedbackData) => {
        const googleScriptURL = 'https://script.google.com/macros/s/AKfycbzz4Kn18vaszFI2g4rG14IWBjJY8Hr2RRor2Pjto2mvw8rN2bqkJmIm2B1rzf4FO3URpQ/exec';

        fetch(googleScriptURL, {
            method: 'POST',
            mode: 'no-cors', // Required for sending data to Google Scripts from a browser.
            body: JSON.stringify(feedbackData) // Data must be sent as a string.
        })
        .then(() => console.log('Feedback submission successfully initiated.'))
        .catch(err => console.error('Network error during submission:', err));
    };

    return (
        <div className="container">
            <header className="header">
                <h1>بوابة الملاحظات المؤسسية</h1>
                <p>نقدر رأيك! استخدم هذه البوابة لتقديم الشكاوى والاقتراحات لتحسين بيئة العمل.</p>
            </header>
            <main className="main-content">
                <div className="form-container">
                    <h2>تقديم ملاحظة جديدة</h2>
                    <FeedbackForm onSubmit={handleNewFeedback} />
                </div>
            </main>
        </div>
    );
}

function FeedbackForm({ onSubmit }) {
    const [type, setType] = useState('شكوى');
    const [author, setAuthor] = useState('');
    const [department, setDepartment] = useState('العامة');
    const [message, setMessage] = useState('');
    const [file, setFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null); // null, 'success', 'error'
    const fileInputRef = useRef(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        e.stopPropagation(); // Add this to prevent other events from firing
        if (!message.trim()) {
            alert('يرجى كتابة تفاصيل الملاحظة.');
            return;
        }
        setIsSubmitting(true);
        let file_url = null;
        try {
            if (file) {
                                // The file upload functionality is currently disabled.
                // We will just log the file name for now.
                console.log('File selected for upload (but not sent):', file.name);
                // file_url will remain null.
            }
            
                        onSubmit({
                type,
                department,
                message,
                file_url,
                author: author.trim() || 'مجهول',
                timestamp: new Date().toISOString()
            });
            // Reset form and show success message
            setSubmitStatus('success');
            setType('شكوى');
            setAuthor('');
            setDepartment('العامة');
            setMessage('');
            setFile(null);
            if(fileInputRef.current) fileInputRef.current.value = '';

            setTimeout(() => setSubmitStatus(null), 3000);
        } catch (error) {
            console.error('Error submitting feedback:', error);
            setSubmitStatus('error');
            setTimeout(() => setSubmitStatus(null), 3000);
        } finally {
            setIsSubmitting(false);
        }
    };

        const departments = ['العامة', 'الموارد البشرية', 'تقنية المعلومات', 'المشتريات', 'التطوير', 'الوجيستك', 'الحسابات', 'الاستقبال', 'شخص معين'];

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="author">الاسم (اختياري)</label>
                <input type="text" id="author" className="input" placeholder="سيتم إرسالها باسم 'مجهول' اذا ترك فارغاً" value={author} onChange={(e) => setAuthor(e.target.value)} />
            </div>
            <div className="form-group">
                <label htmlFor="type">نوع الملاحظة</label>
                <select id="type" className="select" value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="شكوى">شكوى</option>
                    <option value="اقتراح">اقتراح</option>
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="department">القسم المعني</label>
                <select id="department" className="select" value={department} onChange={(e) => setDepartment(e.target.value)}>
                    {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                    ))}
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="message">تفاصيل الملاحظة</label>
                <textarea id="message" rows="4" className="textarea" placeholder="اكتب تفاصيل الشكوى أو الاقتراح هنا..." value={message} onChange={(e) => setMessage(e.target.value)} required></textarea>
            </div>
            <div className="form-group">
                <label htmlFor="file">إرفاق ملف (اختياري)</label>
                                    <input type="file" id="file" className="input" disabled />
                    <small className="feature-disabled-text">(ميزة رفع الملفات غير مفعلة حالياً)</small>
            </div>
            <button type="submit" className="submit-btn" disabled={isSubmitting}>
                {isSubmitting ? 'جاري الإرسال...' : 'إرسال الملاحظة'}
            </button>
            {submitStatus === 'success' && <div className="form-message success">تم إرسال ملاحظتك بنجاح!</div>}
            {submitStatus === 'error' && <div className="form-message error">حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى.</div>}
        </form>
    );
}

function FeedbackFilter({ activeFilter, onFilterChange }) {
    const filters = ['الكل', 'شكوى', 'اقتراح'];
    return (
        <div className="feedback-filters">
            {filters.map(filter => (
                <button
                    key={filter}
                    className={`filter-btn ${activeFilter === filter ? 'active' : ''}`}
                    onClick={() => onFilterChange(filter)}>
                    {filter}
                </button>
            ))}
        </div>
    );
}

function FeedbackList({ feedbackItems }) {
    if (feedbackItems.length === 0) {
        return <div className="empty-state">لا توجد ملاحظات لعرضها حاليًا.</div>;
    }

    // Newest first
    const sortedItems = [...feedbackItems].reverse();

    return (
        <div className="feedback-list">
            {sortedItems.map(item => (
                <FeedbackItem key={item.id} item={item} />
            ))}
        </div>
    );
}

function FeedbackItem({ item }) {
    // Helper to format the date
    const formatDate = (dateString) => {
        if (!dateString) return 'بتاريخ غير محدد';
        return new Date(dateString).toLocaleString('ar', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className={`feedback-item ${item.type === 'شكوى' ? 'complaint' : 'suggestion'}`}>
            <div className="feedback-header">
                <span className="feedback-author"><strong>مقدم الملاحظة:</strong> {item.author || 'مجهول'}</span>
                <span className="feedback-type">{item.type}</span>
                <span className="feedback-department">قسم: {item.department}</span>
            </div>
            <p className="feedback-message">{item.message}</p>
            {item.file_url && (
                <div className="feedback-attachment">
                    <a href={item.file_url} target="_blank" rel="noopener noreferrer">عرض المرفق</a>
                </div>
            )}
            <div className="feedback-footer">
                <span className="feedback-timestamp">{formatDate(item.timestamp)}</span>
            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
