// prisma/seed.js
import { PrismaClient } from '../generated/prisma/index.js';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const profesores = [
    {
      name: 'Antonio Álvarez Sánchez',
      department: 'Ingeniería en Sistemas',
      description: 'Profesor del área de matemáticas.',
      subjects: ['Cálculo Integral'],
    },
    {
      name: 'César Adán Acosta Armendáriz',
      department: 'Ingeniería en Sistemas',
      description: 'Especialista en desarrollo web fullstack.',
      subjects: ['Desarrollo Backend para Web', 'Desarrollo Frontend para Web'],
    },
    {
      name: 'Cinthia Araiza Delgado',
      department: 'Ingeniería en Sistemas',
      description: 'Profesora del área de matemáticas aplicadas.',
      subjects: ['Probabilidad y Estadística'],
    },
    {
      name: 'David Arnoldo Valtierrez Angel',
      department: 'Ingeniería en Sistemas',
      description: 'Especialista en programación e inteligencia artificial.',
      subjects: ['Programación Orientada a Objetos', 'Tópicos Avanzados de Programación', 'Taller de Investigación II', 'Inteligencia Artificial'],
    },
    {
      name: 'Elia Margarita Mata Sáenz',
      department: 'Ingeniería en Sistemas',
      description: 'Profesora del área de matemáticas.',
      subjects: ['Cálculo Vectorial'],
    },
    {
      name: 'Evaristo Escobedo Rodríguez',
      department: 'Ingeniería en Sistemas',
      description: 'Profesor del área de matemáticas aplicadas.',
      subjects: ['Álgebra Lineal'],
    },
    {
      name: 'Gerardo García Soto',
      department: 'Ingeniería en Sistemas',
      description: 'Especialista en redes y administración de bases de datos.',
      subjects: ['Arquitectura de Computadoras', 'Administración de Bases de Datos', 'Conmutación y Enrutamiento en Redes de Datos', 'Administración de Redes'],
    },
    {
      name: 'Gustavo Alfredo Nuñez Baeza',
      department: 'Ingeniería en Sistemas',
      description: 'Especialista en programación y redes de computadoras.',
      subjects: ['Programación Orientada a Objetos', 'Tópicos Avanzados de Programación', 'Redes de Computadoras'],
    },
    {
      name: 'Hilario Ramírez Moreno',
      department: 'Ingeniería en Sistemas',
      description: 'Profesor del área de matemáticas.',
      subjects: ['Cálculo Integral'],
    },
    {
      name: 'Javier Alvarez Martínez',
      department: 'Ingeniería en Sistemas',
      description: 'Profesor del área de ciencias básicas.',
      subjects: ['Física General'],
    },
    {
      name: 'Jesús Rodríguez López',
      department: 'Ingeniería en Sistemas',
      description: 'Profesor del área de electrónica y sistemas digitales.',
      subjects: ['Principios Eléctricos y Aplicaciones Digitales'],
    },
    {
      name: 'Johan Pérez Fonseca',
      department: 'Ingeniería en Sistemas',
      description: 'Especialista en sistemas operativos, telecomunicaciones y bases de datos.',
      subjects: ['Taller de Sistemas Operativos', 'Fundamentos de Telecomunicaciones', 'Taller de Bases de Datos'],
    },
    {
      name: 'Jorge Luis González Hernández',
      department: 'Ingeniería en Sistemas',
      description: 'Profesor del área de sistemas operativos.',
      subjects: ['Taller de Sistemas Operativos'],
    },
    {
      name: 'Juan Antonio Solano Sánchez',
      department: 'Ingeniería en Sistemas',
      description: 'Profesor del área de matemáticas.',
      subjects: ['Ecuaciones Diferenciales'],
    },
    {
      name: 'Julio César Chavarría Ortiz',
      department: 'Ingeniería en Sistemas',
      description: 'Especialista en investigación de operaciones y simulación.',
      subjects: ['Investigación de Operaciones', 'Simulación'],
    },
    {
      name: 'Laura Imelda Franco Díaz',
      department: 'Ingeniería en Sistemas',
      description: 'Profesora del área económico-administrativa.',
      subjects: ['Contabilidad Financiera'],
    },
    {
      name: 'Luis Raúl Lujan Vega',
      department: 'Ingeniería en Sistemas',
      description: 'Especialista en graficación y tecnologías móviles.',
      subjects: ['Graficación', 'Lenguajes de Interfaz', 'Tecnologías Móviles I'],
    },
    {
      name: 'Maria de los Ángeles Mata Sáenz',
      department: 'Ingeniería en Sistemas',
      description: 'Profesora del área de matemáticas aplicadas.',
      subjects: ['Probabilidad y Estadística'],
    },
    {
      name: 'Maria del Rosario Baray Guerrero',
      department: 'Ingeniería en Sistemas',
      description: 'Profesora del área de ciencias básicas.',
      subjects: ['Química'],
    },
    {
      name: 'Osvaldo Javier Díaz Ávila',
      department: 'Ingeniería en Sistemas',
      description: 'Profesor del área económico-administrativa.',
      subjects: ['Cultura Empresarial'],
    },
    {
      name: 'Raul Vázquez Tiscareño',
      department: 'Ingeniería en Sistemas',
      description: 'Especialista en estructuras de datos, sistemas operativos e ingeniería de software.',
      subjects: ['Estructura de Datos', 'Sistemas Operativos I', 'Ingeniería de Software', 'Programación Lógica y Funcional', 'Tecnologías Móviles II'],
    },
    {
      name: 'Rocio C. Nevarez Gonzalez',
      department: 'Ingeniería en Sistemas',
      description: 'Especialista en programación orientada a objetos y bases de datos.',
      subjects: ['Programación Orientada a Objetos', 'Fundamentos de Bases de Datos'],
    },
    {
      name: 'Sofia Irene Díaz Ortiz',
      department: 'Ingeniería en Sistemas',
      description: 'Especialista en ingeniería y gestión de software.',
      subjects: ['Fundamentos de Ingeniería de Software', 'Ingeniería de Software', 'Gestión de Proyectos de Software', 'Desarrollo Ágil de Software'],
    },
    {
      name: 'Victor Manuel González Miranda',
      department: 'Ingeniería en Sistemas',
      description: 'Especialista en redes y programación web.',
      subjects: ['Redes de Computadoras', 'Programación Web'],
    },
    {
      name: 'Vladimir Estupiñon Links Lopez',
      department: 'Ingeniería en Sistemas',
      description: 'Profesor del área de ciencias básicas.',
      subjects: ['Química'],
    },
    {
      name: 'Yamel Yadira Holguin Negrete',
      department: 'Ingeniería en Sistemas',
      description: 'Profesora del área de desarrollo sustentable.',
      subjects: ['Desarrollo Sustentable'],
    },
  ];

  for (const prof of profesores) {
    // Crear o encontrar las materias
    const subjectRecords = await Promise.all(
      prof.subjects.map(async (subjectName) => {
        return await prisma.subject.upsert({
          where: { code: subjectName.toLowerCase().replace(/\s+/g, '-') },
          update: {},
          create: {
            name: subjectName,
            code: subjectName.toLowerCase().replace(/\s+/g, '-'),
          },
        });
      })
    );

    // Crear el profesor
    const professor = await prisma.professor.create({
      data: {
        name: prof.name,
        department: prof.department,
        description: prof.description,
      },
    });

    // Crear una Class por cada materia (semester y group genéricos)
    await Promise.all(
      subjectRecords.map((subject) =>
        prisma.class.create({
          data: {
            professorId: professor.id,
            subjectId: subject.id,
            semester: '2025-1',
            group: 'A',
          },
        })
      )
    );

    console.log(`✅ ${prof.name}`);
  }

  console.log('\n🎉 Todos los profesores de Sistemas creados');
}

main().catch(console.error).finally(() => prisma.$disconnect());