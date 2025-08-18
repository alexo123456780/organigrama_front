-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 18-08-2025 a las 08:29:06
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `db_organigrama_empresarial`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `puestos`
--

CREATE TABLE `puestos` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `nivel_jerarquia` int(11) NOT NULL,
  `area_departamento` varchar(50) NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT 1,
  `puesto_superior_id` int(11) DEFAULT NULL,
  `fecha_creacion` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `fecha_modificacion` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `usuario_creador` varchar(50) DEFAULT NULL,
  `usuario_modificador` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `puestos`
--

INSERT INTO `puestos` (`id`, `nombre`, `descripcion`, `nivel_jerarquia`, `area_departamento`, `status`, `puesto_superior_id`, `fecha_creacion`, `fecha_modificacion`, `usuario_creador`, `usuario_modificador`) VALUES
(2, 'Director Generall', 'Máxima autoridad de la empresa', 1, 'Dirección', 1, NULL, '2025-08-16 21:26:45.517910', '2025-08-17 23:58:10.000000', 'admin', 'admin'),
(3, 'Gerente de Recursos Humanos', 'Responsable de la gestión del talento humano, reclutamiento, capacitación y desarrollo organizacionalllllll', 2, 'Recursos Humanos', 1, 2, '2025-08-17 12:11:51.251405', '2025-08-17 20:03:21.000000', 'admin', 'admin'),
(4, 'Subdirector de Operaciones', 'Responsable de supervisar las operaciones diarias de la empresa', 2, 'Dirección', 1, 2, '2025-08-17 23:53:40.129475', '2025-08-17 23:53:40.129475', 'admin', NULL),
(5, 'Subdirector Financiero', 'Responsable de la gestión financiera y contable de la empresa', 2, 'Finanzas', 1, 2, '2025-08-17 23:54:38.250619', '2025-08-17 23:54:38.250619', 'admin', NULL),
(6, 'Jefe de Recursos Humanos', 'Supervisa el departamento de recursos humanos y sus políticas', 3, 'Recursos Humanos', 1, 3, '2025-08-17 23:57:17.956626', '2025-08-18 00:27:10.058819', 'admin', NULL),
(7, 'Gerente de Ventas', 'Responsable de la estrategia comercial y el equipo de ventas', 2, 'Ventas', 1, 2, '2025-08-18 00:27:10.104397', '2025-08-18 00:27:10.104397', 'admin', NULL),
(8, 'Gerente de Marketing', 'Responsable de la estrategia de marketing y comunicación', 2, 'Marketing', 1, 2, '2025-08-18 00:27:10.104397', '2025-08-18 00:27:10.104397', 'admin', NULL),
(9, 'Gerente de TI', 'Responsable de la infraestructura tecnológica y sistemas', 2, 'Tecnología', 1, 2, '2025-08-18 00:27:10.104397', '2025-08-18 00:27:10.104397', 'admin', NULL),
(10, 'Gerente de Producción', 'Responsable de la planificación y control de producción', 2, 'Producción', 1, 4, '2025-08-18 00:27:10.104397', '2025-08-18 00:27:10.104397', 'admin', NULL),
(11, 'Jefe de Ventas Nacionales', 'Supervisa las ventas en el mercado nacional', 3, 'Ventas', 1, 7, '2025-08-18 00:27:10.104397', '2025-08-18 00:27:10.104397', 'admin', NULL),
(12, 'Jefe de Ventas Internacionales', 'Supervisa las ventas en mercados internacionales', 3, 'Ventas', 1, 7, '2025-08-18 00:27:10.104397', '2025-08-18 00:27:10.104397', 'admin', NULL),
(13, 'Jefe de Marketing Digital', 'Responsable de estrategias digitales y redes sociales', 3, 'Marketing', 1, 8, '2025-08-18 00:27:10.104397', '2025-08-18 00:27:10.104397', 'admin', NULL),
(14, 'Jefe de Publicidad', 'Responsable de campañas publicitarias y creatividad', 3, 'Marketing', 1, 8, '2025-08-18 00:27:10.104397', '2025-08-18 00:27:10.104397', 'admin', NULL),
(15, 'Jefe de Desarrollo de Software', 'Responsable del desarrollo y mantenimiento de aplicaciones', 3, 'Tecnología', 1, 9, '2025-08-18 00:27:10.104397', '2025-08-18 00:27:10.104397', 'admin', NULL),
(16, 'Jefe de Infraestructura TI', 'Responsable de servidores, redes y seguridad informática', 3, 'Tecnología', 1, 9, '2025-08-18 00:27:10.104397', '2025-08-18 00:27:10.104397', 'admin', NULL),
(17, 'Jefe de Control de Calidad', 'Responsable de asegurar los estándares de calidad', 3, 'Producción', 1, 10, '2025-08-18 00:27:10.104397', '2025-08-18 00:27:10.104397', 'admin', NULL),
(18, 'Jefe de Mantenimiento', 'Responsable del mantenimiento preventivo y correctivo', 3, 'Producción', 1, 10, '2025-08-18 00:27:10.104397', '2025-08-18 00:27:10.104397', 'admin', NULL),
(19, 'Contador General', 'Responsable de la contabilidad general y reportes financieros', 3, 'Finanzas', 1, 5, '2025-08-18 00:27:10.104397', '2025-08-18 00:27:10.104397', 'admin', NULL),
(20, 'Jefe de Tesorería', 'Responsable del flujo de caja y inversiones', 3, 'Finanzas', 1, 5, '2025-08-18 00:27:10.104397', '2025-08-18 00:27:10.104397', 'admin', NULL),
(21, 'Especialista en Nómina', 'Responsable del cálculo y pago de nóminas', 3, 'Recursos Humanos', 1, 6, '2025-08-18 00:27:10.104397', '2025-08-18 00:27:10.104397', 'admin', NULL),
(22, 'Especialista en Reclutamiento', 'Responsable de procesos de selección de personal', 3, 'Recursos Humanos', 1, 6, '2025-08-18 00:27:10.104397', '2025-08-18 00:27:10.104397', 'admin', NULL),
(23, 'Coordinador de Ventas Zona Norte', 'Coordina vendedores de la zona norte del país', 4, 'Ventas', 1, 11, '2025-08-18 00:27:10.104397', '2025-08-18 00:27:10.104397', 'admin', NULL),
(24, 'Coordinador de Ventas Zona Sur', 'Coordina vendedores de la zona sur del país', 4, 'Ventas', 1, 11, '2025-08-18 00:27:10.104397', '2025-08-18 00:27:10.104397', 'admin', NULL),
(25, 'Coordinador de Exportaciones', 'Coordina procesos de exportación', 4, 'Ventas', 1, 12, '2025-08-18 00:27:10.104397', '2025-08-18 00:27:10.104397', 'admin', NULL),
(26, 'Community Manager', 'Gestiona redes sociales y comunidades online', 4, 'Marketing', 1, 13, '2025-08-18 00:27:10.104397', '2025-08-18 00:27:10.104397', 'admin', NULL),
(27, 'Analista SEO/SEM', 'Especialista en posicionamiento web y campañas digitales', 4, 'Marketing', 1, 13, '2025-08-18 00:27:10.104397', '2025-08-18 00:27:10.104397', 'admin', NULL),
(28, 'Diseñador Gráfico', 'Responsable del diseño de materiales publicitarios', 4, 'Marketing', 1, 14, '2025-08-18 00:27:10.104397', '2025-08-18 00:27:10.104397', 'admin', NULL),
(29, 'Desarrollador Frontend', 'Especialista en desarrollo de interfaces de usuario', 4, 'Tecnología', 1, 15, '2025-08-18 00:27:10.104397', '2025-08-18 00:27:10.104397', 'admin', NULL),
(30, 'Desarrollador Backend', 'Especialista en desarrollo de servicios y APIs', 4, 'Tecnología', 1, 15, '2025-08-18 00:27:10.104397', '2025-08-18 00:27:10.104397', 'admin', NULL),
(31, 'Administrador de Redes', 'Responsable de la configuración y mantenimiento de redes', 4, 'Tecnología', 1, 16, '2025-08-18 00:27:10.104397', '2025-08-18 00:27:10.104397', 'admin', NULL),
(32, 'Técnico de Soporte', 'Brinda soporte técnico a usuarios internos', 4, 'Tecnología', 1, 16, '2025-08-18 00:27:10.104397', '2025-08-18 00:27:10.104397', 'admin', NULL),
(33, 'Inspector de Calidad', 'Realiza inspecciones y pruebas de calidad', 4, 'Producción', 1, 17, '2025-08-18 00:27:10.104397', '2025-08-18 00:27:10.104397', 'admin', NULL),
(34, 'Técnico de Mantenimiento', 'Ejecuta tareas de mantenimiento de equipos', 4, 'Producción', 1, 18, '2025-08-18 00:27:10.104397', '2025-08-18 00:27:10.104397', 'admin', NULL),
(35, 'Auxiliar Contable', 'Apoya en procesos contables y registros', 4, 'Finanzas', 1, 19, '2025-08-18 00:27:10.104397', '2025-08-18 00:27:10.104397', 'admin', NULL),
(36, 'Analista Financiero', 'Realiza análisis financieros y proyecciones', 4, 'Finanzas', 1, 20, '2025-08-18 00:27:10.104397', '2025-08-18 00:27:10.104397', 'admin', NULL),
(37, 'Vendedor Senior', 'Vendedor con experiencia y cartera de clientes grandes', 5, 'Ventas', 1, 23, '2025-08-18 00:27:10.104397', '2025-08-18 00:27:10.104397', 'admin', NULL),
(38, 'Vendedor Junior', 'Vendedor con poca experiencia, clientes pequeños', 5, 'Ventas', 1, 23, '2025-08-18 00:27:10.104397', '2025-08-18 00:27:10.104397', 'admin', NULL),
(39, 'Vendedor Senior Sur', 'Vendedor experimentado zona sur', 5, 'Ventas', 1, 24, '2025-08-18 00:27:10.104397', '2025-08-18 00:27:10.104397', 'admin', NULL),
(40, 'Asistente de Marketing', 'Apoya en actividades operativas de marketing', 5, 'Marketing', 1, 26, '2025-08-18 00:27:10.104397', '2025-08-18 00:27:10.104397', 'admin', NULL),
(41, 'Operario de Producción A', 'Operario de línea de producción turno matutino', 5, 'Producción', 1, 10, '2025-08-18 00:27:10.104397', '2025-08-18 00:27:10.104397', 'admin', NULL),
(42, 'Operario de Producción B', 'Operario de línea de producción turno vespertino', 5, 'Producción', 1, 10, '2025-08-18 00:27:10.104397', '2025-08-18 00:27:10.104397', 'admin', NULL),
(43, 'Operario de Almacén', 'Responsable de recepción y despacho de mercancía', 5, 'Producción', 1, 10, '2025-08-18 00:27:10.104397', '2025-08-18 00:27:10.104397', 'admin', NULL),
(44, 'Asistente Administrativo RRHH', 'Apoya en procesos administrativos de recursos humanos', 5, 'Recursos Humanos', 1, 6, '2025-08-18 00:27:10.104397', '2025-08-18 00:27:10.104397', 'admin', NULL),
(45, 'Recepcionista', 'Atiende visitantes y llamadas telefónicas', 5, 'Administración', 1, 2, '2025-08-18 00:27:10.104397', '2025-08-18 00:27:10.104397', 'admin', NULL),
(46, 'Conserje', 'Responsable de limpieza y mantenimiento básico', 5, 'Administración', 1, 2, '2025-08-18 00:27:10.104397', '2025-08-18 00:27:10.104397', 'admin', NULL),
(47, 'Chofer', 'Responsable de transporte de personal y documentos', 5, 'Administración', 1, 4, '2025-08-18 00:27:10.104397', '2025-08-18 00:27:10.104397', 'admin', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `userName` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `rol` enum('admin','editor','view') NOT NULL DEFAULT 'view',
  `estaActivo` tinyint(4) NOT NULL DEFAULT 1,
  `createdAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `userName`, `password`, `rol`, `estaActivo`, `createdAt`, `updatedAt`) VALUES
(1, 'admin', '$2b$10$KZPGM3xuhPimHzsB3lHldOmc2ChSVthGrbIs52Mqi3D5LxHSUZmjO', 'admin', 1, '2025-08-16 20:32:01.216116', '2025-08-16 20:32:01.216116'),
(2, 'editor', '$2b$10$BenWFU7lnG5DtPcfYzZyxeLJgd0tFCMeAUEWPTmrdKrCqiES3oACC', 'editor', 1, '2025-08-16 20:32:01.334035', '2025-08-16 20:32:01.334035'),
(3, 'visualizador', '$2b$10$BkU97ZJRfg/Qns3YzhyIfeMWnrLmc6mnbC8RjMBz3EPDZlmfhb3P2', 'view', 1, '2025-08-16 20:32:01.466666', '2025-08-16 20:32:01.466666');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `puestos`
--
ALTER TABLE `puestos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_27de2a53b47421d613a542c1e4a` (`puesto_superior_id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_e37cd632074e05be44a7cafd88` (`userName`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `puestos`
--
ALTER TABLE `puestos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `puestos`
--
ALTER TABLE `puestos`
  ADD CONSTRAINT `FK_27de2a53b47421d613a542c1e4a` FOREIGN KEY (`puesto_superior_id`) REFERENCES `puestos` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
