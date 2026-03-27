import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

function certNumber(email: string, year: number): string {
  let hash = 0
  for (let i = 0; i < email.length; i++) {
    hash = ((hash << 5) - hash) + email.charCodeAt(i)
    hash |= 0
  }
  return `NEURO-${year}-${Math.abs(hash).toString().padStart(6, '0').slice(0, 5)}`
}

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FAFAF9',
    fontFamily: 'Helvetica',
  },
  topBand: {
    backgroundColor: '#0B1221',
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 28,
  },
  topLeft: {
    color: '#FFFFFF',
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 2,
  },
  topRight: {
    color: '#7C6FCD',
    fontSize: 9,
    letterSpacing: 1.5,
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 48,
    paddingVertical: 12,
  },
  accentBar: {
    width: 64,
    height: 3,
    backgroundColor: '#7C3AED',
    marginBottom: 14,
    borderRadius: 2,
  },
  certLabel: {
    fontSize: 40,
    fontFamily: 'Helvetica-Bold',
    color: '#7C3AED',
    letterSpacing: 8,
    marginBottom: 4,
  },
  certSubLabel: {
    fontSize: 13,
    color: '#374151',
    letterSpacing: 3,
    marginBottom: 22,
  },
  certAccredits: {
    fontSize: 11,
    color: '#6B7280',
    marginBottom: 10,
  },
  certName: {
    fontSize: 30,
    fontFamily: 'Helvetica-Bold',
    color: '#0B1221',
    marginBottom: 18,
    letterSpacing: 0.5,
  },
  certBody: {
    fontSize: 11,
    color: '#374151',
    textAlign: 'center',
    lineHeight: 1.6,
  },
  pillarsText: {
    fontSize: 10,
    color: '#7C3AED',
    marginTop: 10,
    letterSpacing: 1.5,
  },
  divider: {
    width: 48,
    height: 1,
    backgroundColor: '#E5E7EB',
    marginTop: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 36,
    paddingBottom: 20,
    paddingTop: 4,
  },
  signatureBlock: {
    alignItems: 'flex-start',
    width: 120,
  },
  signatureLine: {
    width: 100,
    height: 1,
    backgroundColor: '#D1D5DB',
    marginBottom: 5,
  },
  signatureName: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#111827',
  },
  signatureRole: {
    fontSize: 8,
    color: '#9CA3AF',
    marginTop: 2,
  },
  certMeta: {
    alignItems: 'center',
    flex: 1,
  },
  certNum: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: '#9CA3AF',
    letterSpacing: 1,
    marginBottom: 3,
  },
  certDate: {
    fontSize: 8,
    color: '#9CA3AF',
  },
  qrBox: {
    width: 50,
    height: 50,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid #E5E7EB',
  },
  qrText: {
    fontSize: 7,
    color: '#9CA3AF',
    fontFamily: 'Helvetica-Bold',
  },
  bottomBand: {
    backgroundColor: '#0B1221',
    height: 10,
  },
})

type Props = {
  nombre: string
  email: string
  completionDate: string
}

export default function CertificadoDocument({ nombre, email, completionDate }: Props) {
  const year = new Date(completionDate).getFullYear()
  const certNum = certNumber(email || 'user@berzosaneuro.com', year)
  const dateFormatted = new Date(completionDate).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.topBand}>
          <Text style={styles.topLeft}>BERZOSA NEURO</Text>
          <Text style={styles.topRight}>MÉTODO N.E.U.R.O.®</Text>
        </View>

        <View style={styles.body}>
          <View style={styles.accentBar} />
          <Text style={styles.certLabel}>CERTIFICADO</Text>
          <Text style={styles.certSubLabel}>DE GUÍA CERTIFICADO</Text>
          <Text style={styles.certAccredits}>Este certificado acredita que</Text>
          <Text style={styles.certName}>{nombre || 'Nombre del Participante'}</Text>
          <Text style={styles.certBody}>
            ha completado con éxito el Programa de Certificación Oficial
          </Text>
          <Text style={styles.certBody}>
            Método N.E.U.R.O.® · 12 Semanas · 84 Días de Práctica Continua
          </Text>
          <Text style={styles.pillarsText}>
            Supraconciencia · Metacognición · Neuroplasticidad
          </Text>
          <View style={styles.divider} />
        </View>

        <View style={styles.footer}>
          <View style={styles.signatureBlock}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureName}>Borja Berzosa</Text>
            <Text style={styles.signatureRole}>Fundador, Método N.E.U.R.O.®</Text>
          </View>
          <View style={styles.certMeta}>
            <Text style={styles.certNum}>{certNum}</Text>
            <Text style={styles.certDate}>{dateFormatted}</Text>
          </View>
          <View style={styles.qrBox}>
            <Text style={styles.qrText}>QR</Text>
          </View>
        </View>

        <View style={styles.bottomBand} />
      </Page>
    </Document>
  )
}
