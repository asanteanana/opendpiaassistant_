# Open DPIA Assistant 🛡️

An open-source web application for conducting **Data Protection Impact Assessments (DPIAs)** as required by GDPR Article 35. Built with FastAPI, Next.js, and modern web technologies.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.9+-blue.svg)
![Next.js](https://img.shields.io/badge/next.js-15-black.svg)

## ✨ Features

- **📋 Guided Questionnaire** - Step-by-step assessment process with categorized questions
- **⚡ Real-time Risk Calculation** - Automatic risk scoring based on responses
- **🎨 Modern UI** - Beautiful, responsive interface with dark mode support
- **📊 Risk Analysis** - Comprehensive risk breakdown by category
- **💡 Smart Recommendations** - Automatic mitigation suggestions based on GDPR
- **📄 Export Reports** - Generate PDF and JSON reports for compliance
- **🔒 GDPR Compliant** - Built-in references to GDPR articles
- **🌙 Dark Mode** - Full dark mode support
- **📱 Responsive** - Works on desktop, tablet, and mobile

## 🏗️ Architecture

### Backend (FastAPI)
- **Framework**: FastAPI with async support
- **Database**: SQLAlchemy ORM (SQLite/PostgreSQL)
- **API**: RESTful API with Pydantic validation
- **Risk Engine**: Custom risk calculation algorithm
- **Export**: PDF generation with ReportLab

### Frontend (Next.js 15)
- **Framework**: Next.js 15 with App Router
- **UI**: React 19 with TypeScript
- **Styling**: Tailwind CSS v4
- **Animations**: Motion (Framer Motion fork)
- **State**: React Hooks
- **API Client**: Axios

## 🚀 Quick Start

### Prerequisites

- **Python 3.9+**
- **Node.js 20+**
- **npm** or **yarn**

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/open-dpia-assistant.git
cd open-dpia-assistant
```

2. **Set up the backend**

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Initialize database
cd backend
python -c "from db import init_db; init_db()"
```

3. **Set up the frontend**

```bash
cd frontend
npm install

# Set up environment variables
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
```

### Running the Application

**Terminal 1 - Backend:**

```bash
cd backend
python app.py
# Backend will run on http://localhost:8000
# API docs available at http://localhost:8000/docs
```

**Terminal 2 - Frontend:**

```bash
cd frontend
npm run dev
# Frontend will run on http://localhost:3000
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 Usage

### Creating an Assessment

1. **Dashboard** - Click "New Assessment" and fill in basic details
2. **Questionnaire** - Answer questions across 6 categories:
   - Data Collection
   - Data Subjects
   - Processing Purpose & Legal Basis
   - Data Security
   - Data Sharing & Transfers
   - Data Subject Rights
3. **Review** - View risk analysis and recommendations
4. **Export** - Download PDF or JSON report

### Understanding Risk Levels

- **Low (< 0.3)** - Minimal risk, standard controls sufficient
- **Medium (0.3 - 0.6)** - Moderate risk, additional safeguards recommended
- **High (0.6 - 0.8)** - Significant risk, enhanced controls required
- **Critical (> 0.8)** - Severe risk, immediate action needed

### Risk Calculation

The risk engine evaluates responses based on:

1. **Data Sensitivity** (25%) - Type of personal data processed
2. **Data Volume** (15%) - Number of data subjects
3. **Data Subjects** (20%) - Vulnerable groups (children, patients)
4. **Processing Purpose** (15%) - Legal basis and purpose
5. **Third Parties** (10%) - Data sharing and transfers
6. **Security Measures** (15%) - Technical and organizational controls

Special multipliers apply for:
- Special category data (×1.3)
- Children's data (×1.2)

## 🗂️ Project Structure

```
open-dpia-assistant/
├── backend/
│   ├── app.py              # FastAPI application
│   ├── db.py               # Database configuration
│   ├── models.py           # SQLAlchemy models
│   ├── schemas.py          # Pydantic schemas
│   ├── config.py           # Configuration
│   └── utils/
│       ├── risk.py         # Risk calculation engine
│       ├── export.py       # PDF/JSON export
│       └── helpers.py      # Helper functions
├── frontend/
│   ├── pages/
│   │   ├── index.tsx       # Dashboard
│   │   ├── assessment.tsx  # Questionnaire
│   │   └── report.tsx      # Results & Export
│   ├── components/
│   │   ├── QuestionCard.tsx
│   │   ├── RiskBadge.tsx
│   │   ├── MitigationList.tsx
│   │   └── ExportButtons.tsx
│   ├── utils/
│   │   ├── api.ts          # API client
│   │   ├── types.ts        # TypeScript types
│   │   └── helpers.ts      # Utility functions
│   └── styles/
│       └── tailwind.css    # Global styles
├── data/
│   ├── questions.json      # DPIA questions
│   └── gdpr_articles.json  # GDPR article references
├── requirements.txt        # Python dependencies
├── config.py              # Root configuration
└── README.md
```

## 🔧 Configuration

### Backend Configuration

Edit `backend/config.py` or use environment variables:

```python
DATABASE_URL = "sqlite:///./dpia_assistant.db"
SECRET_KEY = "your-secret-key"
CORS_ORIGINS = ["http://localhost:3000"]
```

### Frontend Configuration

Edit `.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 📝 API Documentation

Once the backend is running, access the interactive API documentation:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Key Endpoints

- `POST /api/assessments` - Create assessment
- `GET /api/assessments` - List all assessments
- `GET /api/assessments/{id}` - Get assessment
- `POST /api/assessments/{id}/responses` - Submit response
- `GET /api/assessments/{id}/risk-summary` - Get risk analysis
- `GET /api/assessments/{id}/export/pdf` - Export as PDF
- `GET /api/questions` - Get all questions
- `GET /api/gdpr-articles` - Get GDPR articles

## 🎨 Customization

### Adding Questions

Edit `data/questions.json`:

```json
{
  "id": "custom-001",
  "text": "Your question here?",
  "type": "multi-select",
  "category": "your-category",
  "options": [...],
  "risk_weight": 0.7,
  "gdpr_articles": ["5", "6"],
  "help_text": "Explanation...",
  "required": true
}
```

### Modifying Risk Weights

Edit `backend/config.py`:

```python
RISK_WEIGHTS = {
    "data_sensitivity": 0.25,
    "data_volume": 0.15,
    # ... customize weights
}
```

### Styling

The app uses Tailwind CSS v4. Customize in `frontend/tailwind.config.ts`:

```typescript
theme: {
  extend: {
    colors: {
      risk: {
        low: '#10b981',
        // ... customize colors
      }
    }
  }
}
```

## 🧪 Testing

### Backend Tests

```bash
cd backend
pytest
```

### Frontend Tests

```bash
cd frontend
npm test
```

## 📦 Deployment

### Backend (Railway/Render/Fly.io)

1. Set environment variables
2. Update `DATABASE_URL` for production database
3. Deploy using platform-specific CLI

### Frontend (Vercel/Netlify)

1. Connect GitHub repository
2. Set `NEXT_PUBLIC_API_URL` environment variable
3. Deploy automatically on push

### Docker (Optional)

```bash
# Build
docker build -t dpia-assistant .

# Run
docker run -p 8000:8000 -p 3000:3000 dpia-assistant
```

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow PEP 8 for Python code
- Use TypeScript for frontend
- Write tests for new features
- Update documentation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **GDPR** - European Union General Data Protection Regulation
- **ICO** - UK Information Commissioner's Office for DPIA guidance
- **Motion Primitives** - Animation components
- **Tailwind CSS** - Utility-first CSS framework

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/open-dpia-assistant/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/open-dpia-assistant/discussions)
- **Email**: support@example.com

## 🗺️ Roadmap

- [ ] User authentication and multi-user support
- [ ] Collaborative assessments
- [ ] Email notifications
- [ ] Assessment templates
- [ ] Automated reminders for reviews
- [ ] Integration with DPO tools
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] API webhooks

## ⚠️ Disclaimer

This tool is provided for informational purposes only and does not constitute legal advice. Organizations should consult with qualified data protection professionals and legal advisors to ensure GDPR compliance.

---

**Built with ❤️ for data protection compliance**
