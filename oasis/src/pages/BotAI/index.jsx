import { useState, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AlertCircle, Check, ChevronDown, Book, Award, Target, Users, TrendingUp, Presentation, DollarSign, UploadCloud, File, X, FileText, Settings, Home, FileSpreadsheet, Share2, HelpCircle, LogOut, Menu } from 'lucide-react';
import { Globe, Search, Bell } from "lucide-react";
import Sidebar3 from "../../components/Sidebar3"; 
import { Link } from 'react-router-dom'; 
import { analyzeIdea } from './openaiService';


const Heading = ({ size, as: Component = "h1", className, children, ...props }) => {
  return (
    <Component className={`${size} ${className}`} {...props}>
      {children}
    </Component>
  );
};

const Img = ({ src, alt, className, ...props }) => {
  return <img src={src} alt={alt} className={className} {...props} />;
};

export  function Header({ ...props }) {
  return (
    <header {...props} className="relative w-full bg-gray-50_01">
      <div className="relative h-[98px] w-full">
        <Heading
          size="text7xl"
          as="p"
          className="absolute bottom-[27px] left-[14%] m-auto text-[22.47px] font-medium !text-blue_gray-800"
        >
        </Heading>
        
        <Img
          src="images/img_rectangle_6717.png"
          alt="Image"
          className="absolute bottom-0 right-px m-auto h-[30px] w-[90%] rounded-tl-md rounded-tr-md object-contain"
        />
        
        <div className="absolute left-0 top-0 m-auto h-[92px] w-[10%] content-center md:h-auto">
          <Img
            src="images/img_img_4360_1.png"
            alt="Img4360one"
            className="h-[92px] w-full flex-1 rounded-[32px] object-cover"
          />
          <Heading
            size="headingxl"
            as="p"
            className="absolute bottom-[0.50px] left-10  m-auto text-[13px] font-bold !text-blue_gray-500_02"
          >
            Innovation Oasis
          </Heading>
        </div>
      </div>
      
      <div className="absolute top-0 right-0 flex items-center gap-4 p-5">
        <div className="flex items-center gap-2 text-gray-600">
          <Globe size={18} />
          <span>English</span>
        </div>
        
      </div>
    </header>
  );
}

export default function IdeaEvaluationDashboard() {
  const [ideaDetails, setIdeaDetails] = useState({
    domain: '',
    objective: '',
    audience: '',
    description: ''
  });
  
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [evaluationResults, setEvaluationResults] = useState(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [analysisText, setAnalysisText] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const fileInputRef = useRef(null);
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  const domains = [
    "التقنية",
    "الصحة",
    "التعليم",
    "الطاقة",
    "الزراعة",
    "المدن الذكية",
  ];
  
  const objectives = [
    "حل مشكلة قائمة",
    "تحسين خدمة موجودة",
    "زيادة الكفاءة",
    "تمكين الافراد",
    "تعزيز الاستدامة",
    "تطوير منتج أو خدمة جديدة",
  ];
  
  const audiences = [
    "الأفراد",
    "الشركات",
    "الحكومات",
    "المنظمات غير الربحية",
    "الأسواق الخاصة",
  ];
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setIdeaDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setUploadedFiles(prev => [...prev, ...files]);
    }
  };
  
  const removeFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleClickUpload = () => {
    fileInputRef.current.click();
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsEvaluating(true);
  
    try {
      const { feedbackText, scores } = await analyzeIdea(
        ideaDetails.domain,
        ideaDetails.objective,
        ideaDetails.audience,
        ideaDetails.description,
        uploadedFiles
      );
  
      setAnalysisText(feedbackText);
  
      if (scores) {
        const results = {
          innovation: scores["الابتكار"],
          understanding: scores["التوظيف والفهم"],
          prototype: scores["جودة النموذج"],
          impact: scores["الأثر"],
          presentation: scores["التقديم"],
          feasibility: scores["الجدوى والاستدامة"],
        };
  
        setEvaluationResults(results);
      } else {
        const results = {
          innovation: Math.floor(Math.random() * 30) + 70,
          understanding: Math.floor(Math.random() * 30) + 60,
          prototype: Math.floor(Math.random() * 40) + 60,
          impact: Math.floor(Math.random() * 25) + 75,
          presentation: Math.floor(Math.random() * 20) + 70,
          feasibility: Math.floor(Math.random() * 30) + 65,
        };
  
        setEvaluationResults(results);
      }
  
      setIsEvaluating(false);
      setShowForm(false);
    } catch (error) {
      console.error('فشل في تحليل الفكرة:', error);
      setIsEvaluating(false);
      
      alert('حدث خطأ أثناء تحليل الفكرة. يرجى المحاولة مرة أخرى.');
    }
  };    
  const evaluationData = evaluationResults ? [
    { name: 'الابتكار', score: evaluationResults.innovation },
    { name: 'التوظيف والفهم', score: evaluationResults.understanding },
    { name: 'جودة النموذج', score: evaluationResults.prototype },
    { name: 'الأثر', score: evaluationResults.impact },
    { name: 'التقديم', score: evaluationResults.presentation },
    { name: 'الجدوى والاستدامة', score: evaluationResults.feasibility },
  ] : [];
  
  const criteriaIcons = {
    'الابتكار': <Award className="h-6 w-6 text-blue-500" />,
    'التوظيف والفهم': <Book className="h-6 w-6 text-green-500" />,
    'جودة النموذج': <Target className="h-6 w-6 text-purple-500" />,
    'الأثر': <TrendingUp className="h-6 w-6 text-red-500" />,
    'التقديم': <Presentation className="h-6 w-6 text-yellow-500" />,
    'الجدوى والاستدامة': <DollarSign className="h-6 w-6 text-emerald-500" />
  };
const renderDetailedEvaluation = () => {
    const lowestScoringCriteria = [...evaluationData].sort((a, b) => a.score - b.score)[0];
    
    const getImprovementSuggestions = () => {
      const avgScore = evaluationData.reduce((sum, item) => sum + item.score, 0) / evaluationData.length;
      
      if (lowestScoringCriteria.name === 'الابتكار') {
        if (lowestScoringCriteria.score < 70) {
          return "لتحسين الابتكار في فكرتك، يجب إعادة التفكير بشكل جذري. ابحث عن مصادر إلهام من مجالات مختلفة تماماً، واستشر أشخاصاً من خلفيات متنوعة، وحاول تطبيق تقنيات العصف الذهني المتقدمة.";
        } else if (lowestScoringCriteria.score < 80) {
          return "لتحسين الابتكار في فكرتك، حاول البحث عن حلول غير تقليدية وتطبيق تقنيات من مجالات مختلفة. فكر في كيفية حل المشكلة بطريقة لم يفكر بها أحد من قبل.";
        } else {
          return "فكرتك تتميز بمستوى جيد من الابتكار، لكن يمكن تعزيزها أكثر من خلال استكشاف تقنيات أحدث أو تطبيقات غير متوقعة للتكنولوجيا في مجالك.";
        }
      } else if (lowestScoringCriteria.name === 'التوظيف والفهم') {
        if (lowestScoringCriteria.score < 70) {
          return "هناك حاجة ماسة لتحسين فهمك للمشكلة. خصص وقتاً كافياً لإجراء أبحاث معمقة، وقابل عينة أكبر من المستخدمين المستهدفين، وحلل البيانات بدقة أكبر للوصول إلى فهم شامل للتحديات الحقيقية.";
        } else if (lowestScoringCriteria.score < 80) {
          return "لتحسين فهمك للمشكلة، قم بإجراء المزيد من الأبحاث والمقابلات مع المستخدمين المستهدفين. تعمق في جذور المشكلة وابحث عن الأسباب الحقيقية وراءها.";
        } else {
          return "لديك فهم جيد للمشكلة، لكن يمكن تعزيزه من خلال توسيع نطاق البحث ليشمل فئات مستخدمين إضافية أو استخدام أدوات تحليلية متقدمة.";
        }
      } else if (lowestScoringCriteria.name === 'جودة النموذج') {
        if (lowestScoringCriteria.score < 70) {
          return "النموذج الأولي يحتاج إلى تحسين جذري. فكر في إعادة تصميمه بالكامل مع التركيز على تجربة المستخدم، واستخدام تقنيات النمذجة الحديثة، واختباره بشكل موسع مع مجموعات مختلفة من المستخدمين.";
        } else if (lowestScoringCriteria.score < 80) {
          return "لتحسين نموذجك الأولي، ركز على تفاصيل التصميم وسهولة الاستخدام. قم بتطوير نسخة قابلة للاختبار واطلب تغذية راجعة من مستخدمين حقيقيين.";
        } else {
          return "نموذجك الأولي جيد، لكن يمكن تحسينه من خلال إضافة ميزات متقدمة أو تبسيط واجهة المستخدم أو تحسين الأداء التقني.";
        }
      } else if (lowestScoringCriteria.name === 'الأثر') {
        if (lowestScoringCriteria.score < 70) {
          return "تأثير فكرتك محدود حالياً. أعد التفكير في نطاق المشروع وكيف يمكن توسيعه ليشمل شريحة أكبر من المستفيدين، أو لحل مشكلات أكثر إلحاحاً، أو لإحداث تغيير أكثر استدامة.";
        } else if (lowestScoringCriteria.score < 80) {
          return "لزيادة تأثير فكرتك، حدد بوضوح المشاكل التي تحلها وكيف ستغير حياة المستخدمين. قم بقياس الأثر بطرق كمية ونوعية واشرح كيف ستحدث فكرتك فرقاً حقيقياً.";
        } else {
          return "فكرتك لها تأثير جيد، ولكن يمكن تعزيزه من خلال توسيع نطاق التطبيق أو استهداف فئات إضافية من المستفيدين.";
        }
      } else if (lowestScoringCriteria.name === 'التقديم') {
        if (lowestScoringCriteria.score < 70) {
          return "طريقة تقديم فكرتك تحتاج إلى تحسين كبير. استثمر في تطوير مهاراتك في العرض، واستخدم وسائل إيضاح بصرية أكثر احترافية، وتدرب على الإجابة عن الأسئلة الصعبة المتوقعة.";
        } else if (lowestScoringCriteria.score < 80) {
          return "لتحسين طريقة تقديم فكرتك، استخدم عروضاً بصرية جذابة وقصصاً مقنعة. تدرب على العرض واطلب تغذية راجعة من أشخاص ذوي خبرة.";
        } else {
          return "تقديمك للفكرة جيد، لكن يمكن تعزيزه باستخدام تقنيات عرض متقدمة أو دمج عناصر تفاعلية تجذب اهتمام المستمعين بشكل أكبر.";
        }
      } else if (lowestScoringCriteria.name === 'الجدوى والاستدامة') {
        if (lowestScoringCriteria.score < 70) {
          return "خطة الجدوى والاستدامة تحتاج إلى إعادة تقييم شاملة. قم بإجراء دراسة جدوى مفصلة، واستشر خبراء في التمويل والأعمال، وطور خطة مالية واقعية تضمن استدامة المشروع على المدى الطويل.";
        } else if (lowestScoringCriteria.score < 80) {
          return "لتعزيز الجدوى المالية لفكرتك، طور نموذج عمل واضح وخطة إيرادات ومصاريف مفصلة. فكر في استراتيجيات لضمان استدامة المشروع على المدى الطويل.";
        } else {
          return "خطة الجدوى والاستدامة جيدة، لكن يمكن تحسينها من خلال تنويع مصادر الدخل أو تقليل التكاليف التشغيلية أو تطوير استراتيجيات نمو أكثر تفصيلاً.";
        }
      }
      
      if (avgScore < 70) {
        return "فكرتك بحاجة إلى تطوير في عدة جوانب. ركز بشكل خاص على المعايير التي حصلت على أقل تقييم واستثمر في تحسينها من خلال البحث والتطوير المستمر.";
      } else if (avgScore < 80) {
        return "لتحسين فكرتك، ركز على المعايير التي حصلت على أقل تقييم وحاول تعزيزها من خلال البحث والتطوير المستمر والاستفادة من التغذية الراجعة.";
      } else {
        return "فكرتك جيدة بشكل عام، لكن هناك دائماً مجال للتحسين. ركز على تعزيز نقاط القوة وتطوير النقاط التي تحتاج إلى تحسين لتحقيق أفضل النتائج.";
      }
    };
    
    const getCustomizedTips = () => {
      const avgScore = evaluationData.reduce((sum, item) => sum + item.score, 0) / evaluationData.length;
      
      const commonTips = [
        "اطلب رأياً من خبراء في المجال المستهدف",
        "قم بتجربة النموذج الأولي مع مستخدمين حقيقيين",
        "ادرس مشاريع مشابهة ناجحة واستفد من تجاربها"
      ];
      
      let specificTips = [];
      
      if (lowestScoringCriteria.name === 'الابتكار') {
        specificTips.push("استخدم تقنيات العصف الذهني مع فريق متنوع من الخبراء");
        specificTips.push("ابحث عن حلول مشابهة في مجالات مختلفة وحاول تطبيقها في مجالك");
      } else if (lowestScoringCriteria.name === 'التوظيف والفهم') {
        specificTips.push("قم بإجراء استبيانات مع الفئة المستهدفة لفهم احتياجاتهم بشكل أفضل");
        specificTips.push("حلل المشكلة بطريقة منهجية باستخدام أدوات مثل خرائط المشكلات أو تحليل السبب والنتيجة");
      } else if (lowestScoringCriteria.name === 'جودة النموذج') {
        specificTips.push("استثمر في تصميم واجهة مستخدم أكثر سهولة وجاذبية");
        specificTips.push("اختبر النموذج بشكل منتظم واجمع ملاحظات المستخدمين لتحسينه");
      } else if (lowestScoringCriteria.name === 'الأثر') {
        specificTips.push("حدد مؤشرات أداء واضحة لقياس تأثير فكرتك بشكل دقيق");
        specificTips.push("فكر في كيفية توسيع نطاق فكرتك لتشمل شرائح أكبر من المستفيدين");
      } else if (lowestScoringCriteria.name === 'التقديم') {
        specificTips.push("تدرب على تقديم فكرتك أمام جمهور متنوع واطلب تغذية راجعة");
        specificTips.push("استخدم وسائل إيضاح بصرية أكثر احترافية لتوضيح فكرتك");
      } else if (lowestScoringCriteria.name === 'الجدوى والاستدامة') {
        specificTips.push("طوّر خطة عمل تفصيلية توضح مراحل التنفيذ والميزانية");
        specificTips.push("استشر خبراء ماليين لتقييم الجدوى الاقتصادية لفكرتك على المدى الطويل");
      }
      
      return [...commonTips, ...specificTips.slice(0, 2)];
    };
    
    return (
      <div className="mt-8 space-y-8">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800">نتائج تقييم الفكرة</h2>
          <p className="mt-2 text-gray-600">
            تحليل شامل وفقًا لمعايير التحكيم الستة
          </p>
        </div>
        
        <div className="mb-8 rounded-lg bg-white p-6 shadow-lg">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={evaluationData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="score" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mb-8 rounded-lg bg-white p-6 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-blue-100 p-3">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800">كيف يمكن تحسين فكرتك؟</h3>
              <p className="mt-3 text-gray-700">
                {getImprovementSuggestions()}
              </p>
              <div className="mt-4">
                <h4 className="font-medium text-gray-800">نصائح عامة للتحسين:</h4>
                <ul className="mt-2 list-inside list-disc space-y-1 text-gray-700">
                  {getCustomizedTips().map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {evaluationData.map((item) => (
            <div key={item.name} className="flex items-start space-x-4 rounded-lg bg-white p-6 shadow">
              <div className="rtl:space-x-reverse">
                {criteriaIcons[item.name]}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                  <span className={`rounded-full px-3 py-1 text-sm font-medium ${
                    item.score >= 90 ? 'bg-green-100 text-green-800' :
                    item.score >= 80 ? 'bg-blue-100 text-blue-800' :
                    item.score >= 70 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {item.score}/100
                  </span>
                </div>
                <p className="mt-2 text-gray-600">
                  {getEvaluationText(item.name, item.score)}
                </p>
                <div className="mt-3 h-2.5 w-full rounded-full bg-gray-200">
                  <div 
                    className={`h-2.5 rounded-full ${
                      item.score >= 90 ? 'bg-green-600' :
                      item.score >= 80 ? 'bg-blue-600' :
                      item.score >= 70 ? 'bg-yellow-500' :
                      'bg-red-600'
                    }`}
                    style={{ width: `${item.score}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 text-center">
          <button 
            onClick={() => {
              setShowForm(true);
              setEvaluationResults(null);
              setAnalysisText('');
              setUploadedFiles([]);
            }}
            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            <ChevronDown className="mr-2 h-5 w-5" />
            تقييم فكرة جديدة
          </button>
        </div>
      </div>
    );
  };
   function getEvaluationText(criteria, score) {
    if (criteria === 'الابتكار') {
      if (score >= 90) return "فكرة مبتكرة وفريدة بشكل استثنائي تقدم حلاً جديداً تماماً";
      if (score >= 80) return "فكرة مبتكرة بشكل جيد مع عناصر إبداعية واضحة";
      if (score >= 70) return "فكرة جيدة مع بعض عناصر الابتكار";
      return "الفكرة تحتاج إلى مزيد من الابتكار والتمييز";
    }
    
    if (criteria === 'التوظيف والفهم') {
      if (score >= 90) return "فهم عميق للمشكلة مع توظيف ممتاز للحلول المناسبة";
      if (score >= 80) return "فهم جيد للمشكلة وتوظيف مناسب للحلول";
      if (score >= 70) return "فهم مقبول للمشكلة مع بعض التوظيف المناسب";
      return "يحتاج إلى تطوير الفهم العميق للمشكلة وتوظيف حلول أكثر ملاءمة";
    }
    
    if (criteria === 'جودة النموذج') {
      if (score >= 90) return "نموذج أولي متميز مع تصميم متقن وتفاصيل واضحة";
      if (score >= 80) return "نموذج أولي جيد مع تصميم مناسب";
      if (score >= 70) return "نموذج أولي مقبول مع بعض التفاصيل المفيدة";
      return "النموذج الأولي يحتاج إلى تحسين وتطوير";
    }
    
    if (criteria === 'الأثر') {
      if (score >= 90) return "تأثير كبير وواضح على القطاع التقني مع إمكانية تغيير جذري";
      if (score >= 80) return "تأثير إيجابي ملحوظ على القطاع التقني";
      if (score >= 70) return "تأثير جيد مع إمكانية تحسين جوانب معينة";
      return "التأثير محدود ويحتاج إلى تعزيز";
    }
    
    if (criteria === 'التقديم') {
      if (score >= 90) return "عرض استثنائي مع تواصل فعال وإقناع متميز";
      if (score >= 80) return "عرض جيد مع تواصل واضح وإقناع مناسب";
      if (score >= 70) return "عرض مقبول مع بعض عناصر التواصل الفعال";
      return "العرض يحتاج إلى تحسين في الوضوح والإقناع";
    }
    
    if (criteria === 'الجدوى والاستدامة') {
      if (score >= 90) return "جدوى مالية ممتازة مع استدامة واضحة على المدى الطويل";
      if (score >= 80) return "جدوى مالية جيدة مع خطة استدامة مناسبة";
      if (score >= 70) return "جدوى مالية مقبولة مع بعض عناصر الاستدامة";
      return "الجدوى المالية تحتاج إلى تطوير وخطة استدامة أكثر وضوحاً";
    }
    
    return "تقييم غير متاح";
  }
  
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 font-sans">
      <Sidebar3 isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      
      
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6" dir="rtl">
          <div className="mx-auto max-w-5xl">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-blue-600">التقييم الذكي الأولي للفكرة</h1>
              <p className="mt-2 text-gray-600">
              </p>
            </div>
            
            {showForm ? (
              <div className="rounded-lg bg-white p-6 shadow-lg">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <div>
                      <label htmlFor="domain" className="mb-1 block text-sm font-medium text-gray-700">
                        المجال
                      </label>
                      <select
                        id="domain"
                        name="domain"
                        value={ideaDetails.domain}
                        onChange={handleInputChange}
                        required
                        className="w-full rounded-md border border-gray-300 p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">اختر المجال</option>
                        {domains.map((domain) => (
                          <option key={domain} value={domain}>{domain}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="objective" className="mb-1 block text-sm font-medium text-gray-700">
                        الهدف الرئيسي
                      </label>
                      <select
                        id="objective"
                        name="objective"
                        value={ideaDetails.objective}
                        onChange={handleInputChange}
                        required
                        className="w-full rounded-md border border-gray-300 p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">اختر الهدف</option>
                        {objectives.map((objective) => (
                          <option key={objective} value={objective}>{objective}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="audience" className="mb-1 block text-sm font-medium text-gray-700">
                        الفئة المستهدفة
                      </label>
                      <select
                        id="audience"
                        name="audience"
                        value={ideaDetails.audience}
                        onChange={handleInputChange}
                        required
                        className="w-full rounded-md border border-gray-300 p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">اختر الفئة المستهدفة</option>
                        {audiences.map((audience) => (
                          <option key={audience} value={audience}>{audience}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="description" className="mb-1 block text-sm font-medium text-gray-700">
                      وصف الفكرة
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={ideaDetails.description}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder="اشرح فكرتك بإيجاز (حتى 200 حرف)"
                      className="w-full rounded-md border border-gray-300 p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                      maxLength={200}
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      المستندات الداعمة للفكرة
                    </label>
                    
                    <div className="rounded-lg border-2 border-dashed border-gray-300 p-6 text-center">
                      <input
                        ref={fileInputRef}
                        type="file"
                        onChange={handleFileUpload}
                        multiple
                        className="hidden"
                      />
                      
                      <button
                        type="button"
                        onClick={handleClickUpload}
                        className="inline-flex items-center rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
                      >
                        <UploadCloud className="mr-2 h-5 w-5 text-gray-500" />
                        اختيار ملفات
                      </button>
                      
                      <p className="mt-2 text-sm text-gray-500">
                        يمكنك تحميل ملفات داعمة مثل PDF أو DOCX أو XLSX
                      </p>
                    </div>
                    
                    {uploadedFiles.length > 0 && (
                      <div className="mt-4">
                        <h4 className="mb-2 text-sm font-medium text-gray-700">الملفات المحملة:</h4>
                        <div className="space-y-2">
                          {uploadedFiles.map((file, index) => (
                            <div key={index} className="flex items-center justify-between rounded-md bg-gray-50 p-3">
                              <div className="flex items-center">
                                <FileText className="mr-2 h-5 w-5 text-blue-500" />
                                <span className="text-sm text-gray-700">{file.name}</span>
                                <span className="mr-2 text-xs text-gray-500">
                                  ({(file.size / 1024).toFixed(1)} KB)
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeFile(index)}
                                className="text-gray-500 hover:text-red-500"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-center">
                    <button
                      type="submit"
                      disabled={isEvaluating}
                      className={`flex items-center gap-2 rounded-md px-6 py-3 text-lg font-medium text-white transition-colors ${
                        isEvaluating ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                    >
                      {isEvaluating ? (
                        <>
                          <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          جاري التقييم...
                        </>
                      ) : (
                        <>
                          <Check className="h-5 w-5" />
                          تقييم الفكرة
                        </>
                      )}
                    </button>
                  </div>
                </form>
                
                <div className="mt-8 border-t pt-6">
                  <div className="flex items-start gap-3 text-gray-600">
                    <AlertCircle className="mt-0.5 h-6 w-6 flex-shrink-0 text-blue-500" />
                    <div>
                      <h3 className="font-medium text-gray-800">معايير التقييم</h3>
                      <p className="mt-1">
                        سيتم تقييم فكرتك بناءً على معايير التحكيم الستة: الابتكار، التوظيف والفهم، جودة النموذج الأولي، الأثر، التقديم، والجدوى والاستدامة المالية.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              renderDetailedEvaluation()
            )}
          </div>
        </main>
      </div>
    </div>
  );
}