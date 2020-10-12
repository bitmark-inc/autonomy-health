export class AppSettings {
  public static DEFAULT_CHART_COLOR = '#EEEEEE';
  public static CHART_COLORS: string[] = ['#00B0DA', '#FDB515', '#EE1F60','#CFDD45', '#D9661F', '#00A598'];
  public static PLACE_NONE_COLOR: string = '#DDD5C7';
  public static PLACE_LIGHT_COLORS: {from: number, to: number, code: string}[] = [
    {from: 0, to: 1.5, code: '#E59898'},
    {from: 1.6, to: 2.5, code: '#EDBD95'},
    {from: 2.6, to: 3.5, code: '#F3D98B'},
    {from: 3.6, to: 4.5, code: '#CCE09F'},
    {from: 4.6, to: 5, code: '#96E49B'}
  ];
  public static PLACE_DARK_COLORS: {from: number, to: number, code: string}[] = [
    {from: 0, to: 1.5, code: '#CC3232'},
    {from: 1.6, to: 2.5, code: '#DB7B2B'},
    {from: 2.6, to: 3.5, code: '#E7B416'},
    {from: 3.6, to: 4.5, code: '#99C140'},
    {from: 4.6, to: 5, code: '#2DC937'}
  ];
  public static RESOURCE_RATINGS: string[] = [
    'requires_face_masks',
    'checks_temperature',
    'provides_hand-washing_facilities',
    'disinfects_equipment',
    'reinforces_physical_distancing'
  ];
  public static SURVEY_ANSWERS = {
    yes: { id: 1, value: 'Yes' },
    no: { id: 2, value: 'No' },

    once: { id: 1, value: 'Once' },
    from2To3: { id: 2, value: '2-3 times' },
    from4To5: { id: 3, value: '4-5 times' },
    from6: { id: 4, value: '6+ times' },

    from0To5: { id: 1, value: '0-5' },
    from5To10: { id: 2, value: '5-10' },
    from11To20: { id: 3, value: '11-20' },
    from20: { id: 4, value: '20+' },

    from0To5People: { id: 1, value: 'No, less than 5 people' },
    from5To10People: { id: 2, value: 'No, 5-10 people' },
    from11To20People: { id: 3, value: 'Yes, 11-20 people' },
    from20People: { id: 4, value: 'Yes, more than 20 people' },

    outside: { id: 1, value: 'Outside' },
    inside: { id: 2, value: 'Inside' },
    mixed: { id: 3, value: 'Mixed (outside and inside)' },

    postive: { id: 1, value: 'Positive' },
    negative: { id: 2, value: 'Negative' },
    waitResult: { id: 3, value: 'Still waiting for the result' },
    neverGotResult: { id: 7, value: 'Never got the result' },

    healthcare: { id: '3a1', value: 'Healthcare' },
    transportation: { id: '3a2', value: 'Transportation' },
    store: { id: '3a3', value: 'Grocery store' },
    restaurant: { id: '3a4', value: 'Restaurant or bar' } ,
    construction: { id: '3a5', value: 'Construction' },
    delivery: { id: '3a6', value: 'Delivery' },
    cleaning: { id: '3a7', value: 'Cleaning or janitorial' },
    publicServant: { id: '3a8', value: 'Public servant (EMT, police, firefighter)' },
    school: { id: '3a9', value: 'School or daycare' },
    techCompany: { id: '3a10', value: 'Tech company' },

    decline: { id: 7, value: 'Decline to answer' },
    notAnswer: { id: 9, value: '' }
  }
}
