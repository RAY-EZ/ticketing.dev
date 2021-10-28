import  request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Ticket } from '../../models/ticket'
import { Order, OrderStatus } from '../../models/order'

it.todo('returns order for logged in user only')