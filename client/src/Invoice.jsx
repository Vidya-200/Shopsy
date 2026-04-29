import {Page, Text, View, Document } from '@react-pdf/renderer';
import { styles } from './styles';

export default function Invoice() {
    const InvoicePDF = () => (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <View>
                        <Text>Invoice</Text>
                        <Text>Invoice Number: 12345</Text>
                        
                    </View>
                    <Text> Section  #1</Text>
                    </View>
                    <View style = {styles.section}>
                        <Text> Section #2</Text>
                    </View>

            </Page>
        </Document>

}