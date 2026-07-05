import { Controller, Get, Query, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ExchangeService } from './exchange.service';

@ApiTags('Exchange')
@Controller('exchange')
export class ExchangeController {
  constructor(private readonly exchangeService: ExchangeService) {}

  @Get('rates')
  @ApiOperation({ summary: 'Obtenir les taux de change actuels' })
  @ApiResponse({ 
    status: 200, 
    description: 'Taux de change pour XOF, EUR, USD' 
  })
  async getRates() {
    return this.exchangeService.getExchangeRates();
  }

  @Get('convert')
  @ApiOperation({ summary: 'Convertir un montant XOF en autres devises' })
  @ApiQuery({ 
    name: 'amount', 
    required: true, 
    description: 'Montant en FCFA (XOF)',
    type: Number 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Montant converti en EUR et USD' 
  })
  async convert(
    @Query('amount', new DefaultValuePipe(0), ParseIntPipe) amount: number,
  ) {
    return {
      source: 'XOF',
      amount: amount,
      converted: this.exchangeService.convertAll(amount),
      symbol: {
        XOF: 'FCFA',
        EUR: '€',
        USD: '$',
      },
    };
  }
}
