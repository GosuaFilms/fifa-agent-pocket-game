import React, { useEffect, useMemo, useState } from "react";
import {
    CheckCircle2, XCircle, RotateCcw, Trophy, Brain,
    BookOpen, Heart, Flame, Timer, Target, Save,
    BarChart3, Layers3, Shield, ChevronRight, Star,
} from "lucide-react";

// ─── DATA ─────────────────────────────────────────────────────────────────────
const QUESTION_BANK = [
    { id: 1, type: "single", category: "RFAF", question: "¿Qué entidad es responsable de conceder licencias a agentes de fútbol de conformidad con el RFAF?", options: ["La UEFA", "La FIFA", "La federación miembro nacional correspondiente", "Las academias que ofrecen cursos para agentes"], correct: [1], explanation: "La FIFA es la única entidad que puede conceder la licencia de agente de fútbol (Art. 4 RFAF)." },
    { id: 2, type: "single", category: "RFAF", question: "¿Puede una persona condenada por un delito de fraude solicitar una licencia de agente?", options: ["Sí, si la condena no está relacionada con el fútbol", "Sí, si transcurren 24 meses desde la sentencia", "Sí, si la condena no es firme", "No"], correct: [3], explanation: "Una condena por fraude excluye permanentemente al candidato de obtener la licencia (Art. 5 RFAF)." },
    { id: 3, type: "single", category: "RFAF", question: "Si un candidato presta servicios de agente sin licencia el 2 de febrero de 2024, ¿cuándo puede volver a solicitar la licencia?", options: ["Al cabo de 12 meses", "Al cabo de 24 meses desde su última actividad no autorizada", "Nunca", "Inmediatamente si paga una multa"], correct: [1], explanation: "El RFAF impone una exclusión de 24 meses desde la última actividad no autorizada (Art. 5 apdo. 1b RFAF)." },
    { id: 4, type: "single", category: "RFAF", question: "¿Cuál es la cuota anual de licencia de agente de fútbol?", options: ["300 USD", "500 USD", "600 USD", "1.000 USD"], correct: [2], explanation: "La cuota anual es de 600 USD, pagadera en un único pago antes del 30 de septiembre de cada año." },
    { id: 5, type: "single", category: "RFAF", question: "¿Cuál es el plazo máximo para pagar la cuota de licencia tras aprobar el examen FIFA?", options: ["30 días", "60 días", "90 días", "180 días"], correct: [2], explanation: "Si no se abona la cuota en 90 días tras aprobar el examen, la solicitud queda automáticamente nula (Art. 7 RFAF)." },
    { id: 6, type: "single", category: "RFAF", question: "La licencia de agente de fútbol tiene una duración:", options: ["De 1 año renovable", "De 2 años renovable", "Indefinida, sujeta a cumplimiento continuo", "Hasta los 65 años del titular"], correct: [2], explanation: "La licencia se concede por tiempo indefinido, pero está sujeta a los requisitos continuos del Art. 17 RFAF." },
    { id: 7, type: "single", category: "RFAF", question: "¿Puede un oficial de un club de fútbol obtener la licencia de agente?", options: ["Sí, sin restricciones", "Sí, solo si trabaja como voluntario", "No, salvo que ocupe un cargo representando intereses de agentes", "Sí, si tiene más de 5 años de experiencia"], correct: [2], explanation: "Los oficiales y empleados de clubes no pueden obtener la licencia, salvo que el cargo sea representando intereses de agentes (Art. 5 RFAF)." },
    { id: 8, type: "single", category: "RFAF", question: "¿Puede un agente representar a la vez al jugador y al club de destino en la misma transacción?", options: ["No, nunca", "Sí, siempre", "Sí, con consentimiento previo y por escrito de ambas partes", "Solo si los honorarios no superan el 3%"], correct: [2], explanation: "La doble representación persona+destino está permitida con consentimiento escrito explícito previo de ambos clientes (Art. 12 RFAF)." },
    { id: 9, type: "single", category: "RFAF", question: "¿Cuál es la duración máxima de un contrato de representación con un jugador o entrenador?", options: ["1 año", "2 años", "3 años", "5 años"], correct: [1], explanation: "El contrato de representación con una persona (jugador/entrenador) no puede superar 2 años. No se admiten cláusulas de renovación automática (Art. 12 RFAF)." },
    { id: 10, type: "multi", category: "RFAF", question: "¿Cuáles son los principales objetivos del RFAF?", options: ["Elevar normas profesionales y éticas mínimas para la profesión de agente", "Brindar asesoramiento jurídico gratuito a los clubes", "Mejorar la transparencia financiera y administrativa", "Organizar eventos benéficos relacionados con el fútbol"], correct: [0, 2], explanation: "Los objetivos del RFAF incluyen elevar estándares profesionales y mejorar la transparencia. El asesoramiento jurídico y los eventos benéficos no son objetivos del reglamento." },
    { id: 11, type: "single", category: "RFAF", question: "¿Cuándo entró en vigor la totalidad del RFAF (incluyendo la actividad del agente)?", options: ["9 de enero de 2023", "30 de septiembre de 2023", "1 de octubre de 2023", "1 de enero de 2024"], correct: [2], explanation: "Los artículos sobre la actividad del agente (11-21) entraron en vigor el 1 de octubre de 2023. Los arts. 1-10 y 22-27 (licencias) lo hicieron el 9 de enero de 2023." },
    { id: 12, type: "single", category: "RFAF", question: "Si la remuneración anual bruta de un jugador supera los 200.000 USD, ¿cuál es el límite de honorarios del agente que le representa?", options: ["5% de la remuneración", "3% de la remuneración", "10% de la remuneración", "6% de la remuneración"], correct: [1], explanation: "Para remuneraciones superiores a 200.000 USD/año, el límite de honorarios por representar a la persona es el 3% (Art. 15 RFAF)." },
    { id: 13, type: "single", category: "RFAF", question: "Si la remuneración anual bruta de un jugador es de 150.000 USD, ¿cuál es el límite de honorarios del agente que le representa?", options: ["3% de la remuneración", "5% de la remuneración", "10% de la remuneración", "Sin límite"], correct: [1], explanation: "Para remuneraciones iguales o inferiores a 200.000 USD/año, el límite de honorarios es el 5% (Art. 15 RFAF)." },
    { id: 14, type: "single", category: "RFAF", question: "¿Cuál es el límite de honorarios del agente de la entidad de origen sobre la indemnización por traspaso?", options: ["3%", "5%", "6%", "10%"], correct: [3], explanation: "El agente de la entidad de origen cobra un máximo del 10% de la indemnización por traspaso, independientemente del importe (Art. 15 RFAF)." },
    { id: 15, type: "single", category: "RFAF", question: "En caso de doble representación (persona + entidad de destino) con remuneración superior a 200.000 USD, ¿cuál es el límite total de honorarios?", options: ["3%", "5%", "6%", "10%"], correct: [2], explanation: "En doble representación con remuneración >200.000 USD, el límite combinado es el 6% de la remuneración (Art. 15 RFAF)." },
    { id: 16, type: "multi", category: "RFAF", question: "¿Qué combinaciones de representación simultánea están PROHIBIDAS por el RFAF?", options: ["Persona (jugador) + entidad de destino", "Entidad de origen + persona (jugador)", "Entidad de origen + entidad de destino", "Las tres partes simultáneamente"], correct: [1, 2, 3], explanation: "Solo está permitida la doble representación persona+destino. Cualquier combinación que incluya a la entidad de origen o a las tres partes está prohibida (Art. 12 RFAF)." },
    { id: 17, type: "single", category: "RFAF", question: "¿Con qué frecuencia deben pagarse los honorarios del agente al amparo del RFAF?", options: ["En un único pago al inicio", "Mensualmente", "Trimestralmente (cada 3 meses)", "Anualmente"], correct: [2], explanation: "Los honorarios deben abonarse en cuotas iguales trimestrales a lo largo de la duración del contrato del cliente (Art. 15 RFAF)." },
    { id: 18, type: "single", category: "RFAF", question: "¿Cuál es el plazo para notificar a la plataforma FIFA la firma de un contrato de representación?", options: ["7 días", "14 días", "30 días", "60 días"], correct: [1], explanation: "El agente tiene 14 días para reportar cualquier contrato de representación, modificación o resolución (Art. 19 RFAF)." },
    { id: 19, type: "single", category: "RFAF", question: "¿Puede un empleado de una agencia sin licencia propia prestar servicios de representación?", options: ["Sí, bajo supervisión del agente licenciado", "Sí, para traspasos nacionales únicamente", "No, solo puede prestar apoyo administrativo", "Sí, si el cliente lo autoriza por escrito"], correct: [2], explanation: "Los empleados sin licencia solo pueden prestar apoyo administrativo; los servicios de representación requieren licencia personal (Art. 6 RFAF)." },
    { id: 20, type: "single", category: "RFAF", question: "¿Cuándo puede un agente contactar con un jugador que tiene contrato vigente con otro agente?", options: ["Nunca mientras el contrato esté vigente", "Solo durante los 2 meses anteriores al vencimiento del contrato", "En cualquier momento si el jugador consiente", "Solo si el otro agente ha incumplido"], correct: [1], explanation: "El contacto solo está permitido en los 2 últimos meses de vigencia del contrato de representación en curso." },
    { id: 21, type: "single", category: "RFAF", question: "¿Es obligatorio que el cliente obtenga asesoramiento jurídico independiente antes de firmar un contrato de representación?", options: ["Sí, siempre", "Sí, solo si es menor de edad", "No, pero el agente debe informarle por escrito de esa posibilidad", "Solo si los honorarios superan 200.000 USD"], correct: [2], explanation: "No es obligatorio, pero el agente debe informar por escrito al cliente de la conveniencia de obtener asesoramiento jurídico independiente (Art. 12 RFAF)." },
    { id: 22, type: "single", category: "RFAF", question: "Jeong es agente de fútbol y quiere vincularse a su club local sin incumplir el RFAF. ¿Qué puede hacer?", options: ["Postularse como director deportivo", "Convertirse en presidente del club", "Hacerse socio ordinario no transferible con un único voto", "Convertirse en entrenador del club"], correct: [2], explanation: "Ser socio ordinario con un único voto no intransferible no se considera 'interés' en el club según el RFAF. Los cargos directivos sí están prohibidos (Art. 5 RFAF / FAQ)." },
    { id: 23, type: "single", category: "RFAF", question: "¿Cuándo pueden los agentes contactar con un jugador menor de edad?", options: ["En cualquier momento con consentimiento paterno", "Solo a partir de los 16 años", "6 meses antes de que el menor pueda firmar su primer contrato profesional", "12 meses antes de que el menor pueda firmar su primer contrato"], correct: [2], explanation: "El contacto con menores solo está permitido dentro de los 6 meses previos a la fecha en que el menor pueda firmar su primer contrato profesional (Art. 12 RFAF)." },
    { id: 24, type: "single", category: "RFAF", question: "¿Cuánto tiempo tiene el agente para subsanar un incumplimiento de los requisitos de elegibilidad antes de que se revoque su licencia?", options: ["30 días", "60 días", "90 días", "6 meses"], correct: [1], explanation: "El agente dispone de 60 días para subsanar el incumplimiento antes de que la licencia sea revocada definitivamente." },
    { id: 25, type: "single", category: "RFAF", question: "¿Gumo puede firmar un contrato de representación con Alyssa (21 años) para conseguirle una convocatoria en la selección nacional?", options: ["Sí, si Alyssa da su consentimiento por escrito", "Sí, la FIFA fomenta el fútbol femenino", "No, porque lograr una convocatoria en selección no es un servicio de representación bajo el RFAF", "Solo si el importe no supera los 200.000 USD"], correct: [2], explanation: "Los contratos de participación en selecciones nacionales no son 'transacciones' según el RFAF. Abogar por una convocatoria no es un servicio de representación regulado." },
    { id: 26, type: "single", category: "RFAF", question: "¿Cuántos elementos mínimos debe contener el contrato de representación?", options: ["2: identidad de partes y honorarios", "3: identidad, duración y honorarios", "5: identidad, duración, honorarios, naturaleza del servicio y firmas", "Solo las firmas de las partes"], correct: [2], explanation: "El Art. 12 RFAF establece 5 elementos mínimos: identidad de partes, duración, honorarios, naturaleza de los servicios y firmas de todas las partes." },
    { id: 27, type: "single", category: "RFAF", question: "Laveen es jugador aficionado, secretario del Bridge Town FC y profesor/entrenador en una escuela. La FIFA rechazó su solicitud de licencia. ¿Cuál es el motivo?", options: ["Es entrenador", "Todas las razones son correctas", "Es futbolista", "Es oficial de un club"], correct: [3], explanation: "La condición de oficial de un club (secretario del Bridge Town FC) es la causa de exclusión. Los cargos en clubes impiden obtener la licencia de agente (Art. 5 RFAF)." },
    { id: 28, type: "single", category: "RFAF", question: "Jo negoció un contrato de 6 meses para Jimmy. El club prorrogó directamente con Jimmy sin consultar a Jo. ¿Qué puede reclamar Jo?", options: ["Honorarios por la prórroga más daños", "Honorarios proporcionales por la prórroga", "Nada, porque el contrato de representación de Jo ya había vencido", "Presentar reclamación ante la FIFA contra el club"], correct: [2], explanation: "Si el contrato de representación de Jo ya había vencido cuando se produjo la prórroga, Jo no tiene derecho a honorarios por esa nueva operación." },
    // RETJ
    { id: 31, type: "single", category: "RETJ", question: "Un jugador profesional puede inscribirse en un máximo de __ clubes durante una temporada.", options: ["2", "3", "4", "Sin límite"], correct: [1], explanation: "Un jugador puede inscribirse en un máximo de 3 clubes durante una temporada, pero solo es elegible para jugar por 2 de ellos en la misma competición (Art. 5 RETJ)." },
    { id: 32, type: "single", category: "RETJ", question: "¿Cuál es la duración máxima de un contrato laboral entre un jugador profesional mayor de 18 años y su club?", options: ["3 años", "4 años", "5 años", "Sin límite"], correct: [2], explanation: "La duración máxima de un contrato laboral profesional es de 5 años (Art. 18 RETJ)." },
    { id: 33, type: "single", category: "RETJ", question: "¿Cuál es la duración máxima de un contrato laboral con un jugador menor de 18 años?", options: ["1 año", "2 años", "3 años", "5 años"], correct: [2], explanation: "Los menores de 18 años solo pueden firmar contratos profesionales de hasta 3 años de duración (Art. 18 RETJ)." },
    { id: 34, type: "single", category: "RETJ", question: "¿Cuántos salarios mensuales pendientes dan derecho al jugador a invocar la causa justificada por impago del Art. 14bis RETJ?", options: ["1 salario", "2 salarios", "3 salarios", "6 salarios"], correct: [1], explanation: "El Art. 14bis establece que 2 salarios mensuales vencidos e impagados, tras notificación con plazo de al menos 15 días, constituyen causa justificada de rescisión." },
    { id: 35, type: "single", category: "RETJ", question: "¿Cuál es la sanción deportiva estándar por ruptura de contrato sin causa justificada durante el período protegido?", options: ["2 meses de restricción de elegibilidad", "4 meses de restricción de elegibilidad", "6 meses de restricción de elegibilidad", "1 año de restricción"], correct: [1], explanation: "La sanción estándar es de 4 meses de restricción de elegibilidad; 6 meses en circunstancias agravantes (Art. 17 RETJ)." },
    { id: 36, type: "single", category: "RETJ", question: "Si el contrato se firmó cuando el jugador tenía 25 años, ¿cuánto dura el período protegido?", options: ["1 año", "2 años", "3 años", "5 años"], correct: [2], explanation: "Si el contrato se firmó antes de los 28 años, el período protegido es de 3 años/temporadas. Al firmarse a los 25, son 3 años (Art. 17 RETJ)." },
    { id: 37, type: "single", category: "RETJ", question: "¿Cuándo puede un club iniciar negociaciones con un jugador cuyo contrato no ha vencido?", options: ["En cualquier momento con permiso del club", "Cuando quedan 12 meses o menos", "Cuando quedan 6 meses o menos", "Nunca antes del vencimiento"], correct: [2], explanation: "Un club puede contactar con un jugador cuyo contrato vence en 6 meses o menos para negociar su fichaje futuro (Art. 17 RETJ)." },
    { id: 38, type: "single", category: "RETJ", question: "¿Puede rescindirse unilateralmente un contrato durante un período de competición?", options: ["Sí, con indemnización", "Sí, si hay causa deportiva justificada", "No, bajo ninguna circunstancia", "Solo si el club está en quiebra"], correct: [2], explanation: "El Art. 16 RETJ prohíbe expresamente la rescisión unilateral durante el período de competición." },
    { id: 39, type: "single", category: "RETJ", question: "¿Qué es una 'transferencia puente' según el RETJ?", options: ["Una transferencia con cláusula de reventa", "Dos transferencias consecutivas del mismo jugador en 16 semanas o menos", "Una cesión en préstamo de menos de 6 meses", "Una transferencia entre clubes de la misma confederación"], correct: [1], explanation: "Según el Art. 5bis RETJ, se presume transferencia puente cuando hay dos transferencias consecutivas en 16 semanas o menos." },
    { id: 40, type: "single", category: "RETJ", question: "¿Puede producirse una transferencia puente si los dos traspasos se dan en un plazo superior a 16 semanas?", options: ["No, en ningún caso", "Solo en traspasos internacionales", "Sí, si se acredita que el objetivo era el club definitivo sin beneficio deportivo para el club puente", "No, a menos que intervenga un agente"], correct: [2], explanation: "Las 16 semanas solo generan una presunción. Si se acredita la intención de eludir la prohibición de TPO, puede haber transferencia puente aunque el plazo sea superior (Art. 5bis RETJ)." },
    { id: 41, type: "single", category: "RETJ", question: "Arthur, jugador brasileño de 16 años residente en Portugal, quiere traspasarse a Italia sin que sus padres se muden. ¿Puede hacerlo?", options: ["No, no hay excepción aplicable", "Sí, si sus padres se mudan con él (Art. 19.2a)", "Sí, siempre que el club italiano cumpla ciertas obligaciones mínimas (Art. 19.2b)", "Sí, sin condiciones adicionales"], correct: [2], explanation: "El Art. 19.2b permite la transferencia de un menor cuando se cumplen requisitos especiales de protección que el club debe garantizar." },
    { id: 42, type: "single", category: "RETJ", question: "¿Cuál es la duración máxima de un préstamo de un jugador profesional?", options: ["6 meses", "1 año", "2 años", "Sin límite"], correct: [1], explanation: "La duración máxima de un préstamo es de 1 año (Art. 10 RETJ)." },
    { id: 43, type: "single", category: "RETJ", question: "Desde julio de 2024, ¿cuántos jugadores puede ceder en préstamo un club simultáneamente?", options: ["4", "6", "8", "Sin límite"], correct: [1], explanation: "Desde el 1 de julio de 2024, un club puede ceder un máximo de 6 profesionales en préstamo y recibir a un máximo de 6 prestados (Art. 10 RETJ)." },
    { id: 44, type: "single", category: "RETJ", question: "¿Está permitida la cláusula de reventa (sell-on clause) entre clubes?", options: ["No, está prohibida por el RETJ", "Sí, el RETJ no prohíbe las cláusulas de reventa entre clubes", "Solo si ambos clubes son de la misma confederación", "Solo con aprobación previa de la FIFA"], correct: [1], explanation: "El RETJ no prohíbe las cláusulas de reventa entre clubes. Lo que prohíbe es la propiedad de derechos económicos por terceros (TPO) ajenos al fútbol (Art. 18ter RETJ)." },
    { id: 45, type: "single", category: "RETJ", question: "¿Cuál es la duración máxima del primer período de inscripción anual?", options: ["4 semanas", "8 semanas", "12 semanas", "16 semanas"], correct: [2], explanation: "El primer período de inscripción tiene una duración de entre 8 y 12 semanas (Art. 6 RETJ)." },
    { id: 46, type: "single", category: "RETJ", question: "¿Cuánto cobra de salario una jugadora durante la baja por maternidad?", options: ["El 100% del salario", "2/3 partes del salario contractual", "El 50% del salario", "Solo el salario mínimo legal"], correct: [1], explanation: "El Art. 18 RETJ (enmendado por la Circular 1887) establece que las jugadoras perciben 2/3 de su salario contractual durante la baja por maternidad." },
    { id: 47, type: "single", category: "RETJ", question: "¿Cuál es la prueba (trial) máxima para jugadores menores de 21 años?", options: ["3 semanas, consecutivas o no", "5 semanas, consecutivas o no", "8 semanas, consecutivas o no", "Sin límite si el club lo autoriza"], correct: [2], explanation: "La duración máxima de la prueba es de 8 semanas (consecutivas o no) para menores de 21 años, y 3 semanas (consecutivas o no) para mayores de 21 (Anexo 1 RETJ)." },
    { id: 48, type: "single", category: "RETJ", question: "¿Cuánto tiempo antes de su entrada en vigor deben comunicarse los períodos de inscripción a la FIFA?", options: ["3 meses", "6 meses", "12 meses", "24 meses"], correct: [2], explanation: "Los períodos de inscripción deben registrarse en el TMS y comunicarse a la FIFA con al menos 12 meses de antelación (Art. 6 / Circular 1936)." },
    // Salvaguardia
    { id: 53, type: "single", category: "Salvaguardia", question: "Anders (personal médico) ve a un agente reunirse en privado con un niño que parece solo, triste y asustado. ¿Qué debe hacer?", options: ["No hacer nada; probablemente no pasa nada grave", "Recomendar al jugador que hable con el agente", "Informar cuanto antes al responsable de salvaguardia; si no existe, a la policía o agencia de protección de menores", "Esperar a que los padres actúen"], correct: [2], explanation: "Ante indicios de riesgo, la acción inmediata es informar al responsable de salvaguardia del club o, en su defecto, a las autoridades competentes." },
    { id: 54, type: "single", category: "Salvaguardia", question: "¿Se debe responder ante cualquier problema de salvaguardia, incluso los de menor gravedad?", options: ["No, solo ante los más graves", "No, consumiría recursos innecesariamente", "Sí, porque responder a incidentes menores puede prevenir problemas más graves", "Solo si hay evidencias suficientes"], correct: [2], explanation: "La respuesta proporcional ante cualquier incidente de salvaguardia es fundamental; ignorar los menos graves puede derivar en situaciones más serias." },
    { id: 55, type: "single", category: "Salvaguardia", question: "¿Cuál es la actitud correcta ante un caso presunto o confirmado de maltrato infantil?", options: ["Valorar las opciones y elegir la que menos te complique", "La inacción no es una opción", "Actuar solo si la situación es muy grave", "Esperar a tener pruebas concluyentes"], correct: [1], explanation: "Ante cualquier caso presunto o confirmado de maltrato, la inacción nunca es una opción válida. Se debe actuar de inmediato." },
    { id: 56, type: "multi", category: "Salvaguardia", question: "¿Cuáles son señales de alerta en la protección de menores?", options: ["Un niño asustado o triste al estar con un adulto", "Un agente que se reúne repetidamente en privado con menores", "Un jugador infantil que mejora su nivel", "Un adulto que prohíbe al menor hablar con nadie sobre sus reuniones"], correct: [0, 1, 3], explanation: "Las señales de alerta incluyen comportamientos del menor que denotan miedo, reuniones privadas no justificadas y prohibiciones de comunicación." },
    { id: 57, type: "single", category: "Salvaguardia", question: "¿Qué herramienta de la FIFA está destinada a la protección de menores en el fútbol?", options: ["FIFA TMS", "FIFA Guardians", "FIFA Connect", "FIFA Compliance"], correct: [1], explanation: "FIFA Guardians es el programa de la FIFA específicamente diseñado para la salvaguardia y protección de menores en el fútbol." },
    { id: 58, type: "single", category: "Salvaguardia", question: "¿Qué requisito formativo debe cumplir un agente antes de representar a menores?", options: ["Solo registrarse en la plataforma FIFA", "Completar el curso de DPC sobre representación de menores", "Obtener una licencia especial adicional", "Obtener el consentimiento de la FIFA en cada caso"], correct: [1], explanation: "El agente debe completar el curso de Desarrollo Profesional Continuo (DPC) sobre representación de menores antes de poder representar a jugadores menores (Art. 12 RFAF)." },
    // Cámara de Compensación
    { id: 59, type: "single", category: "Cámara de Compensación", question: "¿Cuándo entró en vigor el Reglamento de la Cámara de Compensación de la FIFA?", options: ["1 enero 2022", "16 noviembre 2022", "1 octubre 2023", "1 enero 2024"], correct: [1], explanation: "La Cámara de Compensación de la FIFA entró en vigor el 16 de noviembre de 2022 (aprobada el 22 de octubre de 2022)." },
    { id: 60, type: "single", category: "Cámara de Compensación", question: "¿Dónde está ubicada la Cámara de Compensación de la FIFA?", options: ["Suiza", "Francia", "Bélgica", "Alemania"], correct: [1], explanation: "La Cámara de Compensación de la FIFA es una entidad financiera regulada independiente ubicada en Francia." },
    { id: 61, type: "single", category: "Cámara de Compensación", question: "¿A qué traspasos se aplica el Reglamento de la Cámara de Compensación?", options: ["Solo a traspasos masculinos de primera división", "A todos los traspasos donde el derecho a compensaciones por formación se genera desde el 16 de noviembre de 2022", "A todos los traspasos internacionales sin excepción", "Solo a traspasos con indemnización superior a 1 millón de USD"], correct: [1], explanation: "El Reglamento aplica a todos los traspasos donde el factor desencadenante de compensaciones por formación se produce a partir del 16 de noviembre de 2022." },
    { id: 62, type: "single", category: "Cámara de Compensación", question: "¿Cuántos días tiene un club para revisar el EPP antes de que sea definitivo?", options: ["10 días", "15 días", "20 días", "30 días"], correct: [1], explanation: "Tras la Circular 1918 (en vigor desde el 1 de enero de 2025), el período de revisión del EPP se amplió de 10 a 15 días (Art. 9 apdo. 2 Reglamento Cámara de Compensación)." },
    { id: 63, type: "single", category: "Cámara de Compensación", question: "¿Qué ocurre si un club no supera la evaluación de cumplimiento de la Cámara de Compensación?", options: ["30 días sin consecuencias para subsanarlo", "Procedimiento disciplinario y la orden de asignación se reenvía al cabo de 6 meses", "Pierde automáticamente el derecho a compensaciones", "Solo se le impone una multa"], correct: [1], explanation: "El incumplimiento conlleva procedimiento disciplinario bajo Art. 17, y la orden de asignación se reenvía automáticamente transcurridos 6 meses." },
    { id: 64, type: "multi", category: "Cámara de Compensación", question: "¿Qué afirmaciones son correctas sobre la cuenta bancaria para la Cámara de Compensación?", options: ["Solo se acepta pago por transferencia bancaria", "Se admiten monederos electrónicos y criptomonedas", "La cuenta debe estar a nombre del club o entidad vinculada", "No hace falta cuenta bancaria si el club no ha firmado un EPP"], correct: [0, 2], explanation: "La Cámara solo acepta transferencias bancarias desde una cuenta a nombre del club. No se admiten criptomonedas ni monederos electrónicos." },
    { id: 65, type: "single", category: "Cámara de Compensación", question: "Si la federación B no forma parte del proceso de revisión del EPP de un jugador, ¿qué debe hacer?", options: ["No puede hacer nada; el EPP ya es definitivo", "Solicitar su inclusión en el proceso de revisión especificando los períodos de inscripción", "Solicitar a la FIFA que descarte el EPP", "Esperar a que la Secretaría General la incluya automáticamente"], correct: [1], explanation: "La federación B debe proactivamente solicitar su inclusión en el proceso de revisión del EPP y especificar los períodos de inscripción de sus clubes afiliados." },
    { id: 66, type: "single", category: "Cámara de Compensación", question: "¿Cuál es uno de los objetivos específicos de la Cámara de Compensación de la FIFA?", options: ["Garantizar que cada federación tenga un sistema de formación", "Proteger la integridad del sistema de transferencias del fútbol", "Informar a los aficionados sobre los traspasos", "Proteger a los jugadores amateurs"], correct: [1], explanation: "Uno de los objetivos explícitos de la Cámara de Compensación es proteger la integridad del sistema de transferencias del fútbol." },
    // Estatutos FIFA
    { id: 68, type: "single", category: "Estatutos FIFA", question: "¿Cuántos idiomas oficiales tiene la FIFA?", options: ["2", "3", "4", "6"], correct: [2], explanation: "La FIFA tiene 4 idiomas oficiales: alemán, español, francés e inglés. El examen de agente también se realiza en estos 4 idiomas." },
    { id: 69, type: "single", category: "Estatutos FIFA", question: "¿Qué órgano de la FIFA tiene competencia suprema?", options: ["El Consejo de la FIFA", "El Comité Ejecutivo", "El Congreso de la FIFA", "La Secretaría General"], correct: [2], explanation: "El Congreso de la FIFA es el órgano supremo de la organización, formado por representantes de todas las federaciones miembro." },
    { id: 70, type: "single", category: "Estatutos FIFA", question: "¿Cuántas confederaciones componen la FIFA?", options: ["4", "5", "6", "7"], correct: [2], explanation: "La FIFA está compuesta por 6 confederaciones: AFC, CAF, CONCACAF, CONMEBOL, OFC y UEFA." },
    // Tribunal del Fútbol
    { id: 72, type: "single", category: "Tribunal del Fútbol", question: "¿Desde cuándo es competente la Cámara de Agentes del Tribunal del Fútbol?", options: ["1 enero 2023", "9 enero 2023", "1 octubre 2023", "1 enero 2024"], correct: [2], explanation: "La Cámara de Agentes del Tribunal del Fútbol es competente desde el 1 de octubre de 2023 para disputas de contratos de representación de dimensión internacional." },
    { id: 73, type: "single", category: "Tribunal del Fútbol", question: "¿Cuántas cámaras tiene el Tribunal del Fútbol de la FIFA?", options: ["2", "3", "4", "5"], correct: [1], explanation: "El Tribunal del Fútbol tiene 3 cámaras: Cámara de Resolución de Disputas, Cámara del Estatuto del Jugador y Cámara de Agentes." },
    { id: 74, type: "single", category: "Tribunal del Fútbol", question: "¿Cuál es el plazo de prescripción para reclamar ante la Cámara de Agentes?", options: ["1 año", "2 años", "3 años", "5 años"], correct: [1], explanation: "Las reclamaciones ante la Cámara de Agentes deben presentarse en el plazo de 2 años desde el hecho que origina la disputa. Se verifica de oficio." },
    { id: 75, type: "single", category: "Tribunal del Fútbol", question: "¿Son gratuitos los procedimientos ante la Cámara de Agentes?", options: ["No, tienen tasas según la cuantía", "Sí, son gratuitos", "Solo si el agente gana el caso", "Depende de la federación implicada"], correct: [1], explanation: "Los procedimientos ante la Cámara de Agentes del Tribunal del Fútbol son gratuitos (Art. 20 RFAF)." },
    { id: 76, type: "single", category: "Tribunal del Fútbol", question: "Bajo la Circular 1917, ¿cuántas horas tiene la federación anterior para emitir el CTI?", options: ["24 horas", "48 horas", "72 horas", "5 días hábiles"], correct: [2], explanation: "Bajo la Circular 1917 (en vigor desde el 1 de enero de 2025), la federación anterior tiene 72 horas para emitir el CTI. Si no lo hace, la nueva federación puede inscribir al jugador unilateralmente." },
    { id: 77, type: "single", category: "Tribunal del Fútbol", question: "¿Puede una disputa contractual bloquear la emisión del CTI bajo la Circular 1917?", options: ["Sí, si la disputa está pendiente", "Sí, si el Tribunal del Fútbol lo ordena", "No, la emisión del CTI es independiente de cualquier disputa contractual", "Solo si el importe en disputa supera 100.000 USD"], correct: [2], explanation: "Uno de los puntos clave de la Circular 1917 es que ninguna disputa contractual puede bloquear la emisión del CTI." },
    { id: 78, type: "single", category: "Tribunal del Fútbol", question: "Bajo la Circular 1917, ¿cuándo es responsable solidario el nuevo club por la ruptura del contrato del jugador?", options: ["Siempre que el jugador rescinda en período protegido", "Solo cuando se prueba que el nuevo club indujo al jugador a romper el contrato", "Solo cuando el nuevo club lo admite voluntariamente", "Cuando pagó una indemnización superior al valor residual"], correct: [1], explanation: "La Circular 1917 modificó el Art. 17 RETJ: el nuevo club ya no es automáticamente responsable solidario. Solo lo es cuando se prueba que indujo al jugador a incumplir." },
    // Código Disciplinario
    { id: 79, type: "single", category: "Código Disciplinario", question: "Un agente sabe indirectamente que jugadores han amañado un partido y no lo comunica. ¿Qué sanción mínima puede recibir?", options: ["Advertencia y multa de 5.000 CHF", "Multa mínima de 15.000 CHF", "Suspensión de 6 meses", "Ninguna, si el conocimiento fue indirecto"], correct: [1], explanation: "El Código Disciplinario impone una multa mínima de 15.000 CHF por no comunicar infracciones graves como la manipulación de partidos." },
    { id: 80, type: "multi", category: "Código Disciplinario", question: "¿Qué sanciones puede recibir un agente que no comunica indicios de amaño de partidos?", options: ["Multa mínima de 15.000 CHF", "Al menos 2 años de prohibición de actividades futbolísticas", "Inhabilitación permanente automática", "Proceso penal directo por la FIFA"], correct: [0, 1], explanation: "Las sanciones mínimas incluyen una multa de 15.000 CHF y al menos 2 años de prohibición de actividades futbolísticas." },
    { id: 81, type: "single", category: "Código Disciplinario", question: "¿Qué infracciones NO están sujetas a prescripción en el Código Disciplinario de la FIFA?", options: ["Cohecho y corrupción", "Todas las formas de abuso sexual", "Discriminación y difamación", "Falsificación de documentos"], correct: [1], explanation: "Las infracciones que implican abuso sexual no están sujetas a prescripción en el Código Disciplinario de la FIFA." },
    { id: 82, type: "single", category: "Código Disciplinario", question: "¿Qué órgano es competente para decidir sobre incumplimientos del Art. 18bis RETJ (influencia de terceros)?", options: ["El Tribunal del Fútbol", "El Órgano de Instrucción de la Comisión de Ética", "El Órgano de Decisión de la Comisión de Ética", "La Comisión Disciplinaria de la FIFA"], correct: [3], explanation: "La Comisión Disciplinaria de la FIFA es competente para conocer de los incumplimientos del Art. 18bis RETJ sobre influencia de terceros." },
    { id: 83, type: "single", category: "Código Disciplinario", question: "¿Desde qué fecha aplica el Art. 21 apdo. 9 del CDF 2023 sobre acuerdos extrajudiciales?", options: ["16 diciembre 2022", "1 febrero 2023", "1 octubre 2023", "1 enero 2024"], correct: [1], explanation: "El Art. 21 apdo. 9 CDF 2023, que otorga competencia a la Comisión Disciplinaria sobre acuerdos extrajudiciales vinculados a decisiones financieras FIFA/CAS, aplica desde el 1 de febrero de 2023 (Circular 1867)." },
    // Circulares
    { id: 86, type: "single", category: "Circulares", question: "¿Qué caso del TJUE detonó el marco provisional de la Circular 1917?", options: ["Caso Bosman", "Caso C-650/22 (Lassana Diarra)", "Caso Bernard", "Caso Striani"], correct: [1], explanation: "La Circular 1917 fue adoptada en respuesta a la sentencia del TJUE en el caso C-650/22 (Lassana Diarra)." },
    { id: 87, type: "single", category: "Circulares", question: "¿Cuándo entró en vigor el marco provisional de la Circular 1917?", options: ["22 diciembre 2024", "1 enero 2025", "1 febrero 2025", "1 julio 2025"], correct: [1], explanation: "El marco provisional de la Circular 1917 entró en vigor el 1 de enero de 2025." },
    { id: 88, type: "multi", category: "Circulares", question: "La Circular 1887 introdujo enmiendas en el RETJ. ¿Cuáles?", options: ["Derechos de jugadoras y entrenadoras (maternidad, adopción)", "Extensión del Anexo 7 (suspensiones por guerra en Ucrania)", "Declaración en TMS de modificaciones a condiciones de pago (Anexo 3)", "Creación de la Cámara de Agentes"], correct: [0, 1, 2], explanation: "La Circular 1887 (mayo 2024) aborda tres áreas: derechos de jugadoras/entrenadoras, extensión del Anexo 7 (Ucrania) y la obligación de declarar en TMS los cambios en condiciones de pago." },
    { id: 89, type: "single", category: "Circulares", question: "¿Cuánto es la compensación por formación para un club UEFA de categoría I por año de formación?", options: ["60.000 EUR", "90.000 EUR", "50.000 USD", "120.000 EUR"], correct: [1], explanation: "Los clubes UEFA de categoría I reciben 90.000 EUR por año de formación. Cat. II: 60.000 EUR; III: 30.000 EUR; IV: 10.000 EUR (Circular 1936)." },
    { id: 90, type: "single", category: "Circulares", question: "¿Antes de qué fecha deben las federaciones registrar sus categorías de clubes y períodos de inscripción en el TMS?", options: ["30 junio", "31 julio", "30 septiembre", "31 diciembre"], correct: [1], explanation: "Las federaciones deben registrar las categorizaciones y los períodos de inscripción en el TMS antes del 31 de julio de cada año (Circular 1936)." },
    // Estrategia / Examen
    { id: 93, type: "single", category: "Estrategia", question: "¿Cuántas preguntas tiene el examen de agente FIFA?", options: ["15", "20", "25", "30"], correct: [1], explanation: "El examen consta de 20 preguntas. Para aprobar se necesitan al menos 15 correctas (75%)." },
    { id: 94, type: "single", category: "Estrategia", question: "¿Cuánto tiempo se dispone para realizar el examen de agente FIFA?", options: ["30 minutos", "45 minutos", "60 minutos", "90 minutos"], correct: [2], explanation: "El examen tiene una duración de 60 minutos (3 minutos por pregunta de media)." },
    { id: 95, type: "single", category: "Estrategia", question: "¿Cuál es la puntuación mínima para aprobar el examen de agente FIFA?", options: ["60%", "70%", "75%", "80%"], correct: [2], explanation: "Se necesita un mínimo del 75% (15 de 20 preguntas correctas) para superar el examen." },
    { id: 96, type: "single", category: "Estrategia", question: "¿Hay penalización por responder incorrectamente en el examen?", options: ["Sí, se resta 0,5 puntos", "Sí, se resta 1 punto", "No, no hay puntuación negativa", "Solo en las de selección múltiple"], correct: [2], explanation: "El examen NO tiene puntuación negativa. Las respuestas en blanco o incorrectas no penalizan." },
    { id: 97, type: "single", category: "Estrategia", question: "¿Se concede puntuación parcial si se acierta solo parte de una pregunta de selección múltiple?", options: ["Sí, proporcional al número de aciertos", "Sí, la mitad del punto", "No, solo se puntúa la respuesta completamente correcta", "Depende del tipo de pregunta"], correct: [2], explanation: "No existe puntuación parcial. Una respuesta parcialmente correcta vale 0 puntos. Solo la respuesta completa y exacta obtiene el punto." },
    { id: 98, type: "multi", category: "Estrategia", question: "¿Cuáles son los signos de alarma en las opciones de respuesta del examen FIFA?", options: ["'Siempre'", "'Nunca'", "'Solo'", "'Automáticamente'"], correct: [0, 1, 2, 3], explanation: "Las palabras absolutas ('siempre', 'nunca', 'solo', 'automáticamente') son trampas frecuentes en el examen, ya que el derecho rara vez es absoluto." },
    { id: 99, type: "single", category: "Estrategia", question: "¿Cuál es la distribución que concentra mayor peso en el examen?", options: ["RETJ (30%) y Código Disciplinario (25%)", "RFAF (30%) y Salvaguardia (15%)", "Estatutos FIFA (30%) y RETJ (30%)", "RFAF (50%) y Código Ético (25%)"], correct: [1], explanation: "El RFAF acapara el 30% de las preguntas y la Salvaguardia el 15%. Juntos suponen casi la mitad del examen." },
    { id: 100, type: "single", category: "Estrategia", question: "Ante una pregunta sobre porcentajes, plazos o umbrales concretos en el examen abierto, ¿qué es más recomendable?", options: ["Responder de memoria sin perder tiempo", "Verificar el artículo específico en la normativa", "Elegir la opción intermedia", "Dejarla en blanco para evitar errores"], correct: [1], explanation: "En el examen abierto, las preguntas con cifras concretas son las más peligrosas para el 'falso recuerdo'. Siempre verifica el artículo." },
];

const FLASHCARDS = [
    { id: "f1", topic: "RFAF", front: "¿Quién concede la licencia de agente FIFA?", back: "La FIFA (y solo la FIFA). Las federaciones nacionales NO conceden licencias FIFA." },
    { id: "f2", topic: "RFAF", front: "Cuota anual de licencia", back: "600 USD — pago único antes del 30 de septiembre de cada año." },
    { id: "f3", topic: "RFAF", front: "Plazo para pagar cuota tras aprobar el examen", back: "Máximo 90 días. Si no se paga, la solicitud queda automáticamente nula." },
    { id: "f4", topic: "RFAF", front: "Duración máxima contrato agente–jugador/entrenador", back: "2 años. Sin cláusulas de renovación automática. Con club/federación/liga: sin límite." },
    { id: "f5", topic: "RFAF", front: "Honorarios: remuneración ≤ 200.000 USD/año", back: "Máximo 5% por representar a la persona. Doble representación (persona+destino): 10%." },
    { id: "f6", topic: "RFAF", front: "Honorarios: remuneración > 200.000 USD/año", back: "Máximo 3% por representar a la persona. Doble representación (persona+destino): 6%." },
    { id: "f7", topic: "RFAF", front: "Honorarios del agente de la entidad de origen", back: "Máximo 10% de la indemnización por traspaso, independientemente del importe." },
    { id: "f8", topic: "RFAF", front: "Frecuencia de pago de honorarios", back: "Trimestralmente (cada 3 meses), en cuotas iguales, a lo largo del contrato del cliente." },
    { id: "f9", topic: "RFAF", front: "Plazo para reportar contratos a la FIFA", back: "14 días desde la firma, modificación o resolución. Cambios en la agencia: 30 días." },
    { id: "f10", topic: "RFAF", front: "Umbral de remuneración clave (Art. 14/15 RFAF)", back: "200.000 USD/año brutos. Por debajo: el club puede pagar los honorarios en lugar del jugador." },
    { id: "f11", topic: "RFAF", front: "Entrada en vigor completa del RFAF", back: "Arts. 1–10 y 22–27 (licencias): 9 enero 2023.\nResto (actividad agente): 1 octubre 2023." },
    { id: "f12", topic: "RFAF", front: "Contacto con cliente de otro agente", back: "Solo permitido en los últimos 2 meses antes del vencimiento del contrato de representación." },
    { id: "f13", topic: "RFAF", front: "Contacto de agente con jugador menor de edad", back: "Solo dentro de los 6 meses anteriores a la fecha en que el menor pueda firmar su primer contrato profesional." },
    { id: "f14", topic: "RFAF", front: "Plazo para subsanar incumplimiento antes de revocar la licencia", back: "60 días. Transcurrido este plazo sin subsanación, la licencia es revocada." },
    { id: "f15", topic: "RFAF", front: "Exclusión por actividad sin licencia", back: "24 meses desde la última actividad no autorizada para poder solicitar la licencia." },
    { id: "f16", topic: "RETJ", front: "Duración máxima contrato laboral profesional", back: "5 años (mayores de 18). 3 años para menores de 18." },
    { id: "f17", topic: "RETJ", front: "Art. 14bis RETJ — Causa justificada por impago", back: "2 salarios mensuales vencidos. El club debe tener un plazo mínimo de 15 días para pagar tras notificación escrita." },
    { id: "f18", topic: "RETJ", front: "Art. 15 RETJ — Causa deportiva justificada", back: "Participación en menos del 10% de los partidos oficiales de la temporada. Plazo para rescindir: 15 días tras el último partido." },
    { id: "f19", topic: "RETJ", front: "Art. 17 RETJ — Sanción por ruptura en período protegido", back: "4 meses de restricción de elegibilidad (6 con agravantes). Club inductor: prohibición de inscribir durante 2 períodos completos." },
    { id: "f20", topic: "RETJ", front: "Período protegido según edad al firmar el contrato", back: "Antes de los 28 años: 3 temporadas/3 años.\nCon 28 años o más: 2 temporadas/2 años." },
    { id: "f21", topic: "RETJ", front: "Art. 19 RETJ — Transferencia internacional de menores", back: "Prohibida como regla general. Excepciones tasadas (Art. 19.2a: padres se mudan; Art. 19.2b: obligaciones mínimas del club; Art. 19.3: UE/EEE)." },
    { id: "f22", topic: "RETJ", front: "Art. 5bis RETJ — Transferencia puente", back: "Dos transferencias consecutivas en ≤16 semanas: presunción de transferencia puente. Puede ocurrir también en plazos superiores si se acredita la intención." },
    { id: "f23", topic: "RETJ", front: "Art. 18ter RETJ — TPO (Propiedad por terceros)", back: "Prohibida desde el 1 de mayo de 2015. Contratos anteriores: válidos hasta vencimiento, no prorrogables." },
    { id: "f24", topic: "RETJ", front: "Períodos de inscripción — duración", back: "1.er período: 8–12 semanas.\n2.º período: 4–8 semanas.\nTotal máximo de ambos: 16 semanas." },
    { id: "f25", topic: "RETJ", front: "Préstamos — límites desde julio 2024", back: "Máximo 6 cedidos / 6 recibidos. Máximo 3 con un mismo club específico." },
    { id: "f26", topic: "RETJ", front: "Salario jugadora durante baja por maternidad", back: "2/3 de su salario contractual. Duración mínima de la baja: 14 semanas (8 obligatorias tras el parto)." },
    { id: "f27", topic: "Cámara de Compensación", front: "Entrada en vigor Cámara de Compensación FIFA", back: "Aprobada 22 oct 2022. En vigor desde 16 nov 2022. Ubicada en Francia." },
    { id: "f28", topic: "Cámara de Compensación", front: "Período de revisión del EPP (tras Circular 1918)", back: "15 días (ampliado desde 10 días; en vigor desde 1 enero 2025)." },
    { id: "f29", topic: "Tribunal del Fútbol", front: "Cámara de Agentes — datos clave", back: "Competente desde 1 octubre 2023. Procedimientos gratuitos. Prescripción: 2 años." },
    { id: "f30", topic: "Tribunal del Fútbol", front: "Circular 1917 — CTI (plazo de emisión)", back: "72 horas. Si no se emite, la nueva federación puede inscribir al jugador unilateralmente. Ninguna disputa bloquea el CTI." },
    { id: "f31", topic: "Código Disciplinario", front: "Art. 21 apdo. 9 CDF — Acuerdos extrajudiciales", back: "Desde el 1 febrero 2023 la Comisión Disciplinaria puede ejecutar acuerdos extrajudiciales vinculados a decisiones financieras FIFA/TAS sin nueva demanda." },
    { id: "f32", topic: "Código Disciplinario", front: "Infracción sin prescripción en el CDF FIFA", back: "Todas las formas de abuso sexual." },
    { id: "f33", topic: "Circulares", front: "Circular 1827", back: "Aprobación del RFAF (16 diciembre 2022). Reemplaza al reglamento sobre intermediarios." },
    { id: "f34", topic: "Circulares", front: "Circular 1867", back: "Incumplimiento de acuerdos extrajudiciales. Competencia de la Comisión Disciplinaria desde 1 febrero 2023." },
    { id: "f35", topic: "Circulares", front: "Circular 1887", back: "Derechos jugadoras/entrenadoras (maternidad, adopción), extensión Ucrania hasta 30 jun 2025, TMS cambios en pago de traspasos. En vigor: 1 jun 2024." },
    { id: "f36", topic: "Circulares", front: "Circular 1917", back: "Marco provisional post-Diarra (caso C-650/22 TJUE). En vigor 1 enero 2025. CTI en 72h, responsabilidad solidaria solo si se prueba inducción." },
    { id: "f37", topic: "Circulares", front: "Circular 1918", back: "EPP período de revisión: 10 → 15 días. En vigor 1 enero 2025." },
    { id: "f38", topic: "Circulares", front: "Circular 1936 — Categorías y períodos de inscripción", back: "Registro en TMS antes del 31 julio. La categoría no puede cambiarse durante la temporada." },
    { id: "f39", topic: "Examen", front: "Formato del examen de agente FIFA", back: "20 preguntas · 60 minutos · Open book · Online · Sin penalización por error · Sin puntuación parcial." },
    { id: "f40", topic: "Examen", front: "Nota de corte del examen FIFA", back: "75% = 15 de 20 preguntas correctas. Máximo 5 errores permitidos." },
    { id: "f41", topic: "Examen", front: "Compensación formación UEFA por categoría (2025)", back: "Cat. I: 90.000 EUR · Cat. II: 60.000 EUR · Cat. III: 30.000 EUR · Cat. IV: 10.000 EUR (por año de formación)." },
    { id: "f42", topic: "Examen", front: "Compensación formación CONMEBOL por categoría (2025)", back: "Cat. I: 50.000 USD · Cat. II: 30.000 USD · Cat. III: 10.000 USD · Cat. IV: 2.000 USD." },
];

const STORAGE_KEY = "fifa_agent_v4";
const EXAM_DIST = [["RFAF",30],["RETJ",15],["Salvaguardia",15],["Cámara de Compensación",10],["Estatutos FIFA",9],["Tribunal del Fútbol",9],["Código Disciplinario",8],["Circulares",4]];

function arraysEqual(a, b) {
    if (a.length !== b.length) return false;
    return [...a].sort((m,n)=>m-n).every((v,i) => v === [...b].sort((m,n)=>m-n)[i]);
}
function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }
function loadProgress() { try { const r = localStorage.getItem(STORAGE_KEY); return r ? JSON.parse(r) : null; } catch { return null; } }
function saveProgress(d) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(d)); } catch {} }

function ProgressBar({ value, light }) {
    return (
        <div className={`progress-bar-track ${light ? "light" : ""}`}>
            <div className="progress-bar-fill" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
        </div>
    );
}

function Badge({ children, variant = "slate" }) {
    return <span className={`badge badge-${variant}`}>{children}</span>;
}

export default function App() {
    const saved = loadProgress();
    const categories = [...new Set(QUESTION_BANK.map(q => q.category))];
    const flashTopics = [...new Set(FLASHCARDS.map(c => c.topic))];

    const [mode, setMode] = useState("quiz");
    const [sessionType, setSessionType] = useState("normal");
    const [selectedTopic, setSelectedTopic] = useState("Todos");
    const [flashTopic, setFlashTopic] = useState("Todos");
    const [seed, setSeed] = useState(0);
    const [wrongIds, setWrongIds] = useState(saved?.wrongIds || []);
    const [index, setIndex] = useState(0);
    const [selected, setSelected] = useState([]);
    const [checked, setChecked] = useState(false);
    const [answers, setAnswers] = useState({});
    const [lives, setLives] = useState(3);
    const [streak, setStreak] = useState(0);
    const [bestStreak, setBestStreak] = useState(saved?.bestStreak || 0);
    const [points, setPoints] = useState(saved?.points || 0);
    const [timeLeft, setTimeLeft] = useState(180);
    const [savedAt, setSavedAt] = useState(saved?.savedAt || null);
    const [topicStats, setTopicStats] = useState(saved?.topicStats || {});
    const [flashIndex, setFlashIndex] = useState(0);
    const [flashFlipped, setFlashFlipped] = useState(false);
    const [flashTimeLeft, setFlashTimeLeft] = useState(30);
    const [examReviewOpen, setExamReviewOpen] = useState(false);

    const baseQuestions = useMemo(() => {
        let src = QUESTION_BANK;
        if (sessionType === "wrong" && wrongIds.length > 0) src = src.filter(q => wrongIds.includes(q.id));
        if (sessionType === "topic" && selectedTopic !== "Todos") src = src.filter(q => q.category === selectedTopic);
        return src;
    }, [sessionType, wrongIds, selectedTopic]);

    const questions = useMemo(() => {
        const n = (sessionType === "mock" || sessionType === "exam") ? Math.min(20, baseQuestions.length)
            : sessionType === "timer" ? Math.min(12, baseQuestions.length)
            : Math.min(10, baseQuestions.length);
        return shuffle(baseQuestions).slice(0, n);
    }, [seed, sessionType, baseQuestions]);

    const flashcards = useMemo(() => {
        const src = flashTopic === "Todos" ? FLASHCARDS : FLASHCARDS.filter(c => c.topic === flashTopic);
        return shuffle(src);
    }, [seed, flashTopic]);

    const current = questions[index];
    const currentFlash = flashcards[flashIndex];
    const score = Object.values(answers).filter(Boolean).length;
    const progress = questions.length ? ((index + (checked ? 1 : 0)) / questions.length) * 100 : 0;
    const outOfLives = sessionType !== "mock" && sessionType !== "exam" && lives <= 0;
    const timeUp = (sessionType === "timer" || sessionType === "mock" || sessionType === "exam") && timeLeft <= 0;
    const finished = (!!questions.length && index === questions.length - 1 && checked) || outOfLives || timeUp;
    const formatTime = s => `${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`;

    useEffect(() => {
        if ((sessionType !== "timer" && sessionType !== "mock" && sessionType !== "exam") || finished) return;
        const t = setInterval(() => setTimeLeft(s => s > 0 ? s - 1 : 0), 1000);
        return () => clearInterval(t);
    }, [sessionType, finished, seed]);

    useEffect(() => {
        if (mode !== "flashcards") return;
        const t = setInterval(() => setFlashTimeLeft(s => s > 0 ? s - 1 : 0), 1000);
        return () => clearInterval(t);
    }, [mode, flashIndex, seed]);

    useEffect(() => {
        const data = { wrongIds, bestStreak, points, topicStats, savedAt: new Date().toISOString() };
        saveProgress(data); setSavedAt(data.savedAt);
    }, [wrongIds, bestStreak, points, topicStats]);

    useEffect(() => {
        if (mode === "flashcards" && flashTimeLeft <= 0 && flashcards.length > 0) {
            setFlashIndex(i => (i + 1) % flashcards.length); setFlashFlipped(false); setFlashTimeLeft(30);
        }
    }, [flashTimeLeft, flashcards.length, mode]);

    const toggleOption = i => {
        if (checked || !current) return;
        if (current.type === "single") { setSelected([i]); return; }
        setSelected(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);
    };

    const checkAnswer = () => {
        if (!current) return;
        const isCorrect = arraysEqual(selected, current.correct);
        setAnswers(prev => ({ ...prev, [current.id]: isCorrect }));
        setTopicStats(prev => {
            const c = prev[current.category] || { correct:0, wrong:0, total:0 };
            return { ...prev, [current.category]: { correct: c.correct+(isCorrect?1:0), wrong: c.wrong+(isCorrect?0:1), total: c.total+1 }};
        });
        if (isCorrect) {
            const ns = streak + 1; setStreak(ns); setBestStreak(b => Math.max(b, ns));
            const bonus = sessionType==="exam"?10:sessionType==="mock"?8:sessionType==="timer"?5:sessionType==="topic"?3:0;
            setPoints(p => p + 10 + ns*2 + bonus);
        } else {
            if (sessionType !== "mock" && sessionType !== "exam") setLives(l => l - 1);
            setStreak(0); setPoints(p => Math.max(0, p - 3));
            setWrongIds(prev => prev.includes(current.id) ? prev : [...prev, current.id]);
        }
        setChecked(true);
    };

    const nextQuestion = () => {
        if (index < questions.length - 1) { setIndex(index+1); setSelected([]); setChecked(false); setExamReviewOpen(false); }
    };

    const restart = (type = sessionType) => {
        setSessionType(type); setSeed(s => s+1); setIndex(0); setSelected([]); setChecked(false);
        setAnswers({}); setLives(3); setStreak(0); setExamReviewOpen(false);
        setTimeLeft(type==="mock"||type==="exam" ? 3600 : 180);
    };

    const clearProgress = () => {
        setWrongIds([]); setBestStreak(0); setPoints(0); setSavedAt(null); setTopicStats({});
        localStorage.removeItem(STORAGE_KEY);
    };

    const reviewItems = questions.map(q => ({ ...q, wasCorrect: answers[q.id] }));
    const topicEntries = Object.entries(topicStats)
        .map(([topic, s]) => ({ topic, ...s, accuracy: s.total ? Math.round((s.correct/s.total)*100) : 0 }))
        .sort((a,b) => a.accuracy - b.accuracy || b.total - a.total);

    const pct = score && questions.length ? Math.round((score/questions.length)*100) : 0;
    const passed = pct >= 75;

    return (
        <div className="app-shell">
            {/* ── Top Bar ── */}
            <div className="top-bar">
                <div className="top-bar-inner">
                    <div className="top-bar-brand">
                        <div className="top-bar-logo">FA</div>
                        <div>
                            <div className="top-bar-title">FIFA Agent Exam</div>
                            <div className="top-bar-sub">Pocket Game · {QUESTION_BANK.length} preguntas</div>
                        </div>
                    </div>
                    <div className="score-badge">{score}/{questions.length || "—"}</div>
                </div>
            </div>

            <div className="content-area">
                {/* ── Stats Strip ── */}
                <div className="stats-strip">
                    <div className="stat-item">
                        <Heart className="icon-xs stat-icon" />
                        <div className="stat-value">{sessionType==="mock"||sessionType==="exam"?"∞":lives}</div>
                        <div className="stat-label">Vidas</div>
                    </div>
                    <div className="stat-item">
                        <Flame className="icon-xs stat-icon" />
                        <div className="stat-value">{streak}</div>
                        <div className="stat-label">Racha</div>
                    </div>
                    <div className="stat-item">
                        <Target className="icon-xs stat-icon" />
                        <div className="stat-value">{points}</div>
                        <div className="stat-label">Pts</div>
                    </div>
                    <div className="stat-item">
                        <Timer className="icon-xs stat-icon" />
                        <div className="stat-value" style={timeLeft<60&&(sessionType==="timer"||sessionType==="mock"||sessionType==="exam")?{color:"#f87171"}:{}}>
                            {(sessionType==="timer"||sessionType==="mock"||sessionType==="exam") ? formatTime(timeLeft) : mode==="flashcards" ? formatTime(flashTimeLeft) : "libre"}
                        </div>
                        <div className="stat-label">Tiempo</div>
                    </div>
                    <div className="stat-item">
                        <Star className="icon-xs stat-icon" />
                        <div className="stat-value">{bestStreak}</div>
                        <div className="stat-label">Mejor</div>
                    </div>
                </div>

                {/* ── Tabs ── */}
                <div className="tabs-bar">
                    {[["quiz","Juego"],["review","Repaso"],["stats","Stats"],["flashcards","Flashcards"]].map(([v,l]) => (
                        <button key={v} onClick={() => setMode(v)} className={`tab-btn ${mode===v?"tab-btn-active":""}`}>{l}</button>
                    ))}
                </div>

                {/* ══ QUIZ MODE ══════════════════════════════════════════════ */}
                {mode === "quiz" && (
                    <>
                        {/* Mode selector */}
                        <div className="card">
                            <div className="card-body" style={{gap:10}}>
                                <div className="mode-grid">
                                    {[["normal","Modo normal",null],["timer","Contrarreloj 3 min",null],["mock","Simulacro 60 min",null]].map(([t,l]) => (
                                        <button key={t} onClick={() => restart(t)} className={`mode-btn ${sessionType===t?"mode-btn-active":""}`}>{l}</button>
                                    ))}
                                    <button onClick={() => restart("exam")} className={`mode-btn ${sessionType==="exam"?"mode-btn-active":""}`}>
                                        <Shield className="mode-icon" />Modo Examen
                                    </button>
                                    <button onClick={() => restart("wrong")} disabled={wrongIds.length===0} className={`mode-btn ${sessionType==="wrong"?"mode-btn-active":""}`}>
                                        Falladas ({wrongIds.length})
                                    </button>
                                    <button onClick={() => restart("topic")} className={`mode-btn ${sessionType==="topic"?"mode-btn-active":""}`}>
                                        <Layers3 className="mode-icon" />Por Tema
                                    </button>
                                </div>
                                {sessionType === "topic" && (
                                    <div className="topic-grid">
                                        <button className={`topic-btn ${selectedTopic==="Todos"?"topic-btn-active":""}`} onClick={() => { setSelectedTopic("Todos"); restart("topic"); }}>Todos</button>
                                        {categories.map(cat => (
                                            <button key={cat} className={`topic-btn ${selectedTopic===cat?"topic-btn-active":""}`} onClick={() => { setSelectedTopic(cat); restart("topic"); }}>{cat}</button>
                                        ))}
                                    </div>
                                )}
                                <div className="info-note" style={{color:"var(--slate-400)",fontSize:11}}>
                                    {savedAt ? `Guardado: ${new Date(savedAt).toLocaleTimeString()}` : "El progreso se guarda automáticamente"}
                                </div>
                            </div>
                        </div>

                        {questions.length === 0 && (
                            <div className="card"><div className="card-body" style={{textAlign:"center",color:"var(--slate-400)"}}>No hay preguntas disponibles para este modo.</div></div>
                        )}

                        {/* ── Normal / Timer / Mock / Wrong / Topic ── */}
                        {!finished && !!questions.length && sessionType !== "exam" && (
                            <div className="card">
                                <div className="card-header">
                                    <span className="card-header-title">{current?.category}</span>
                                    <span className="card-header-right">{index+1} / {questions.length}</span>
                                </div>
                                <div className="card-body">
                                    <ProgressBar value={progress} light />
                                    <p className="question-text">{current?.question}</p>
                                    <p className="question-type-hint">{current?.type==="single" ? "Selecciona una respuesta" : "Selecciona una o más respuestas"}</p>
                                    <div className="options-list">
                                        {current?.options.map((opt, i) => {
                                            const isSel = selected.includes(i);
                                            const isCorrect = current.correct.includes(i);
                                            const showGreen = checked && isCorrect;
                                            const showRed = checked && isSel && !isCorrect;
                                            return (
                                                <button key={i} onClick={() => toggleOption(i)}
                                                    className={`option-btn ${showGreen?"option-correct":showRed?"option-wrong":isSel?"option-selected":""}`}>
                                                    <div className="option-letter">{String.fromCharCode(65+i)}</div>
                                                    <div className="option-text">{opt}</div>
                                                    {showGreen && <CheckCircle2 className="icon-sm text-green option-check" />}
                                                    {showRed && <XCircle className="icon-sm text-red option-check" />}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    {!checked ? (
                                        <button onClick={checkAnswer} disabled={selected.length===0} className="btn btn-primary btn-full btn-lg">
                                            Comprobar respuesta
                                        </button>
                                    ) : (
                                        <div className={`feedback-box ${answers[current.id]?"feedback-correct":"feedback-wrong"}`}>
                                            <div className="feedback-header">
                                                {answers[current.id] ? <><CheckCircle2 className="icon-sm" />¡Correcto!</> : <><XCircle className="icon-sm" />Incorrecto</>}
                                            </div>
                                            <div className="feedback-explanation">{current?.explanation}</div>
                                            <button onClick={nextQuestion} className="btn btn-primary btn-full">
                                                {index===questions.length-1||outOfLives||timeUp ? "Ver resultado" : <span style={{display:"flex",alignItems:"center",gap:6,justifyContent:"center"}}>Siguiente <ChevronRight className="icon-sm" /></span>}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* ── Exam Mode ── */}
                        {!finished && !!questions.length && sessionType === "exam" && (
                            <div className="exam-card">
                                <div className="exam-header">
                                    <div className="exam-meta">
                                        <div className="exam-badge"><Shield className="icon-xs" />Modo Examen Oficial</div>
                                        <div className={`exam-timer ${timeLeft<120?"exam-timer-urgent":""}`}>{formatTime(timeLeft)}</div>
                                    </div>
                                    <div className="exam-q-meta">
                                        <span className="exam-q-num">Pregunta {index+1} de {questions.length}</span>
                                        <span className="exam-q-cat">{current?.category}</span>
                                    </div>
                                    <ProgressBar value={progress} />
                                    <p className="exam-question">{current?.question}</p>
                                    <p className="exam-type-hint">{current?.type==="single" ? "Selecciona una opción" : "Selecciona una o más opciones"}</p>
                                </div>
                                <div className="exam-body">
                                    <div className="options-list">
                                        {current?.options.map((opt, i) => {
                                            const isSel = selected.includes(i);
                                            return (
                                                <button key={i} onClick={() => toggleOption(i)}
                                                    className={`option-btn option-exam ${isSel?"option-exam-selected":""}`}>
                                                    <div className="option-letter">{String.fromCharCode(65+i)}</div>
                                                    <div className="option-text">{opt}</div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                    {!checked ? (
                                        <div className="btn-row">
                                            <button onClick={nextQuestion} disabled={index===questions.length-1} className="btn btn-ghost-white">Saltar</button>
                                            <button onClick={checkAnswer} disabled={selected.length===0} className="btn btn-gold">Confirmar</button>
                                        </div>
                                    ) : (
                                        <div className="exam-feedback-box">
                                            <div className="exam-feedback-header">
                                                {answers[current.id] ? <CheckCircle2 className="icon-sm text-green" /> : <XCircle className="icon-sm text-red" />}
                                                {answers[current.id] ? "Respuesta correcta" : "Respuesta incorrecta"}
                                            </div>
                                            {examReviewOpen && <div className="exam-feedback-explanation">{current?.explanation}</div>}
                                            <div className="btn-row">
                                                <button onClick={() => setExamReviewOpen(v=>!v)} className="btn btn-ghost-white btn-sm">{examReviewOpen?"Ocultar":"Ver explicación"}</button>
                                                <button onClick={nextQuestion} className="btn btn-gold">
                                                    {index===questions.length-1||timeUp ? "Finalizar" : "Siguiente"}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* ── Results ── */}
                        {finished && !!questions.length && (
                            <div className="card">
                                <div className="results-hero">
                                    <div className="trophy-ring"><Trophy className="icon-lg" /></div>
                                    <div className="results-title">Resultado final</div>
                                    <div className="results-score">{pct}%</div>
                                    <div className="results-label">{score} de {questions.length} preguntas correctas</div>
                                    <div className={`results-pass-msg ${passed?"results-pass":"results-fail"}`}>
                                        {passed ? "✓ Superarías el examen real" : "✗ Necesitas el 75% para aprobar"}
                                    </div>
                                    {timeUp && <div style={{color:"#f87171",fontSize:13}}>Se agotó el tiempo</div>}
                                    {outOfLives && <div style={{color:"#f87171",fontSize:13}}>Sin vidas</div>}
                                </div>
                                <div className="results-stats">
                                    {[[Brain,"Precisión",`${pct}%`],[CheckCircle2,"Correctas",score],[XCircle,"Incorrectas",questions.length-score],[Flame,"Mejor racha",bestStreak]].map(([Icon,label,val]) => (
                                        <div key={label} className="result-stat">
                                            <div className="result-stat-icon"><Icon className="icon-sm" /></div>
                                            <div><div className="result-stat-value">{val}</div><div className="result-stat-label">{label}</div></div>
                                        </div>
                                    ))}
                                </div>
                                <div className="results-actions">
                                    <button onClick={() => setMode("review")} className="btn btn-primary btn-lg btn-full">
                                        <BookOpen className="icon-sm" />Ver repaso
                                    </button>
                                    <button onClick={() => restart(sessionType)} className="btn btn-ghost btn-lg btn-full">
                                        <RotateCcw className="icon-sm" />Jugar otra vez
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* ══ REVIEW ═════════════════════════════════════════════════ */}
                {mode === "review" && (
                    <div className="stack">
                        {reviewItems.length === 0 && <div className="card"><div className="card-body" style={{textAlign:"center",color:"var(--slate-400)"}}>Juega una ronda primero para ver el repaso.</div></div>}
                        {reviewItems.map((q, idx) => (
                            <div key={q.id} className="card">
                                <div className="card-header">
                                    <span className="card-header-title">#{idx+1} · {q.category}</span>
                                    {typeof q.wasCorrect==="boolean" ? (q.wasCorrect ? <Badge variant="green">Correcta</Badge> : <Badge variant="red">Fallada</Badge>) : <Badge>Sin jugar</Badge>}
                                </div>
                                <div className="review-card">
                                    <p className="review-question">{q.question}</p>
                                    <div className="review-options">
                                        {q.options.map((opt,i) => (
                                            <div key={i} className={`review-option ${q.correct.includes(i)?"review-option-correct":""}`}>
                                                <span className="review-option-letter">{String.fromCharCode(65+i)}.</span>{opt}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="review-explanation">{q.explanation}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* ══ STATS ══════════════════════════════════════════════════ */}
                {mode === "stats" && (
                    <div className="stack">
                        <div className="card">
                            <div className="card-header">
                                <span className="card-header-title"><BarChart3 className="icon-xs" style={{display:"inline",marginRight:6}} />Rendimiento por bloque</span>
                            </div>
                            <div style={{padding:"8px 0"}}>
                                {topicEntries.length === 0 ? (
                                    <div style={{padding:"20px",textAlign:"center",color:"var(--slate-400)"}}>Juega algunas rondas para ver estadísticas.</div>
                                ) : topicEntries.map(e => (
                                    <div key={e.topic} className="topic-stat-row">
                                        <div className="topic-stat-header">
                                            <div>
                                                <div className="topic-name">{e.topic}</div>
                                                <div className="topic-detail">{e.correct} bien · {e.wrong} mal · {e.total} intentos</div>
                                            </div>
                                            <Badge variant={e.accuracy>=75?"green":e.accuracy<60?"red":"slate"}>{e.accuracy}%</Badge>
                                        </div>
                                        <ProgressBar value={e.accuracy} light />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="card">
                            <div className="card-header"><span className="card-header-title">Distribución real del examen FIFA</span></div>
                            <div style={{padding:"8px 0"}}>
                                {EXAM_DIST.map(([name, pct]) => (
                                    <div key={name} className="dist-row">
                                        <div className="dist-header"><span className="dist-name">{name}</span><span className="dist-pct">{pct}%</span></div>
                                        <ProgressBar value={pct} light />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="card">
                            <div className="card-body">
                                <p style={{fontSize:13,fontWeight:700,color:"var(--navy)"}}>Datos clave del examen</p>
                                {[["Preguntas","20"],["Tiempo","60 minutos"],["Nota mínima","75% (15/20)"],["Penalización","No"],["Puntuación parcial","No"],["Formato","Open book · Online"]].map(([k,v]) => (
                                    <div key={k} style={{display:"flex",justifyContent:"space-between",fontSize:13,padding:"8px 0",borderBottom:"1px solid var(--slate-100)"}}>
                                        <span style={{color:"var(--slate-500)"}}>{k}</span>
                                        <span style={{fontWeight:700,color:"var(--navy)"}}>{v}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button onClick={clearProgress} className="btn btn-ghost btn-sm" style={{margin:"0 auto"}}>
                            <RotateCcw className="icon-sm" />Borrar progreso guardado
                        </button>
                    </div>
                )}

                {/* ══ FLASHCARDS ═════════════════════════════════════════════ */}
                {mode === "flashcards" && (
                    <div className="stack">
                        <div className="flash-topic-grid">
                            <button className={`flash-topic-btn ${flashTopic==="Todos"?"flash-topic-btn-active":""}`} onClick={() => { setFlashTopic("Todos"); setSeed(s=>s+1); setFlashIndex(0); setFlashFlipped(false); setFlashTimeLeft(30); }}>Todas</button>
                            {flashTopics.map(t => (
                                <button key={t} className={`flash-topic-btn ${flashTopic===t?"flash-topic-btn-active":""}`} onClick={() => { setFlashTopic(t); setSeed(s=>s+1); setFlashIndex(0); setFlashFlipped(false); setFlashTimeLeft(30); }}>{t}</button>
                            ))}
                        </div>

                        {currentFlash && (
                            <div className="flashcard-wrapper">
                                <div className="flashcard-header">
                                    <span className="flashcard-meta">{flashIndex+1} / {flashcards.length}</span>
                                    <span className="flashcard-topic">{currentFlash.topic}</span>
                                </div>

                                <ProgressBar value={((flashIndex+1)/flashcards.length)*100} />

                                <div className="flashcard-body" onClick={() => setFlashFlipped(v=>!v)}>
                                    <div className="flashcard-side-label">{flashFlipped ? "Respuesta" : "Pregunta"} — toca para girar</div>
                                    <div className={`flashcard-content ${flashFlipped?"answer":""}`}>
                                        {flashFlipped ? currentFlash.back : currentFlash.front}
                                    </div>
                                </div>

                                <div style={{padding:"0 20px 4px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                                    <span style={{fontSize:11,color:"rgba(255,255,255,0.35)"}}>Tiempo: {formatTime(flashTimeLeft)}</span>
                                    <ProgressBar value={(flashTimeLeft/30)*100} />
                                </div>

                                <div className="flashcard-footer">
                                    <button className="btn btn-ghost-white btn-sm" onClick={() => setFlashFlipped(v=>!v)}>{flashFlipped?"Ver pregunta":"Girar"}</button>
                                    <button className="btn btn-gold" onClick={() => { setFlashIndex(i=>(i+1)%flashcards.length); setFlashFlipped(false); setFlashTimeLeft(30); }}>
                                        Siguiente <ChevronRight className="icon-sm" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
