import OpenAI from 'openai';

const OPENAI_API_KEY = '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';

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true 
});

function createLocalAnalysis(domain, objective, audience, description, files) {
  let analysis = `بناءً على المعلومات التي قدمتها:

المجال: ${domain}
الهدف الرئيسي: ${objective}
الفئة المستهدفة: ${audience}`;

  if (description) {
    analysis += `\nوصف الفكرة: ${description}`;
  }

  if (files && files.length > 0) {
    analysis += `\nالملفات المرفقة: ${files.length} ملف${files.length > 1 ? 'ات' : ''}`;
  }

  analysis += `\n\nالتقييم المبدئي:
- يبدو أن مشروعك في مجال ${domain} يستهدف شريحة مهمة وهي ${audience}.
- مشروعك يهدف إلى ${objective} وهو هدف قيّم في سوق اليوم.
- هناك فرصة كبيرة للابتكار والتميز في حال تقديم حلول مبتكرة.
- يُنصح بإجراء دراسة سوق مفصلة لفهم احتياجات ${audience} بشكل أعمق.
- من المهم دراسة المنافسين الحاليين في مجال ${domain} وتحديد نقاط التمايز.

نقاط القوة المحتملة:
- تركيز واضح على هدف محدد وهو ${objective}.
- استهداف شريحة واضحة من العملاء (${audience}).
- إمكانية تقديم حلول مخصصة لاحتياجات محددة.
- فرصة للتميز في سوق تنافسي.

التحديات المتوقعة:
- منافسة قوية في سوق ${domain}.
- تحديات تقنية وتنظيمية قد تواجه المشروع.
- الحاجة لاستثمارات أولية كبيرة لتطوير منتج متميز.
- كسب ثقة ${audience} كشريحة مستهدفة.

فرص التطوير والتوسع:
- إمكانية التوسع لشرائح إضافية بعد إثبات نجاح الفكرة مع ${audience}.
- بناء شراكات استراتيجية مع جهات ذات علاقة في مجال ${domain}.
- تطوير منتجات أو خدمات مكملة تعزز من قيمة المشروع الأساسي.
- التوسع الجغرافي لخدمة أسواق جديدة.

نصائح لتحسين الفكرة:
- التركيز على تحديد مشكلة واضحة تحلها فكرتك.
- تصميم تجربة مستخدم مبسطة ومميزة.
- الاستفادة من التقنيات الحديثة لتقديم قيمة إضافية.
- بناء نموذج عمل مستدام يضمن استمرارية المشروع.

الخطوات القادمة المقترحة:
1. إجراء دراسة سوق مفصلة للتأكد من حجم الطلب.
2. تحديد الميزانية المطلوبة والموارد اللازمة.
3. بناء نموذج أولي للمنتج أو الخدمة واختباره مع عينة من ${audience}.
4. البحث عن فرص تمويل مناسبة أو شركاء محتملين.
5. وضع خطة تسويقية مبتكرة للوصول إلى ${audience} بشكل فعال.`;

  if (files && files.length > 0) {
    analysis += `\n\nملاحظة: من المهم مراجعة الملفات المرفقة بدقة لاستخراج المزيد من المعلومات القيمة لتطوير المشروع.`;
  }

  return analysis;
}

export const analyzeIdea = async (domain, objective, audience, description, files) => {
  try {
    let prompt = `
قم بتحليل فكرة المشروع التالية:
المجال: ${domain}
الهدف الرئيسي: ${objective}
الفئة المستهدفة: ${audience}
`;

    if (description) {
      prompt += `وصف الفكرة: ${description}\n`;
    }
    
    if (files && files.length > 0) {
      prompt += `الملفات المرفقة: ${files.length} ملف${files.length > 1 ? 'ات' : ''}\n`;
    }
    
    prompt += `
قدم تحليلاً شاملاً يتضمن:
1. تقييم مبدئي للفكرة
2. نقاط القوة المحتملة
3. التحديات المتوقعة
4. فرص التطوير والتوسع
5. نصائح لتحسين الفكرة
6. الخطوات القادمة المقترحة

كن محدداً ودقيقاً في تحليلك، وقدم إجابة مفصلة ومفيدة بأسلوب مهني وإيجابي.
`;

    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `أنت مساعد الابتكار الذكي باللغة العربية. مهمتك هي تحليل أفكار المشاريع وتقديم توصيات قيمة. قدم إجاباتك باللغة العربية الفصحى وبأسلوب مهني وودي.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1500
      });
      
      const feedbackText = completion.choices[0].message.content;
const ideaId = 20; 
      try {
        await saveEvaluationToDatabase(ideaId, feedbackText);
        console.log('تم حفظ التقييم في قاعدة البيانات بنجاح');
      } catch (dbError) {
        console.error('فشل في حفظ التقييم في قاعدة البيانات:', dbError);
      }
      
      return feedbackText;
    } catch (apiError) {
      console.error('فشل استدعاء OpenAI API:', apiError);
      console.log('سيتم استخدام التحليل المحلي البديل...');
      
      const localAnalysis = createLocalAnalysis(domain, objective, audience, description, files);
      
      try {
        const ideaId = `idea_local_${domain.replace(/\s+/g, '_')}_${Date.now()}`;
        await saveEvaluationToDatabase(ideaId, localAnalysis);
        console.log('تم حفظ التحليل المحلي في قاعدة البيانات بنجاح');
      } catch (dbError) {
        console.error('فشل في حفظ التحليل المحلي في قاعدة البيانات:', dbError);
      }
      
      return localAnalysis;
    }
  } catch (error) {
    console.error('حدث خطأ في تحليل الفكرة:', error);
    
    const localAnalysis = createLocalAnalysis(domain, objective, audience, description, files);
    
    try {
      const ideaId = `idea_fallback_${domain.replace(/\s+/g, '_')}_${Date.now()}`;
      await saveEvaluationToDatabase(ideaId, localAnalysis);
    } catch (dbError) {
      console.error('فشل في حفظ التحليل المحلي في قاعدة البيانات كنظام احتياطي:', dbError);
    }
    
    return localAnalysis;
  }
};

export const saveEvaluationToDatabase = async (ideaId, feedbackText) => {
  try {
    console.log('محاولة حفظ التقييم في قاعدة البيانات...', {
      ideaid: ideaId,
      feedbacktextLength: feedbackText.length,
      evaluationdate: new Date().toISOString()
    });
    
    const response = await fetch('http://localhost:4000/api/ai-evaluation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ideaid: ideaId,
        feedbacktext: feedbackText,
        evaluationdate: new Date().toISOString()
      })
      
    });
    
    if (!response.ok) {
      throw new Error(`فشل في حفظ التقييم: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('خطأ في حفظ التقييم في قاعدة البيانات:', error);
    throw error;
  }
};

export default {
  analyzeIdea,
  saveEvaluationToDatabase
};